//@ts-check
// import { codegen } from '@graphql-codegen/core';
// import { loadSchemaSync, loadDocuments, loadTypedefsSync } from "@graphql-tools/load";
// import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
// import { buildSchema, printSchema as graphqlToString, parse, GraphQLSchema } from 'graphql';
// import * as fs from 'fs';
// import * as path from 'path';
const fs = require('fs');
const path = require('path');
// import * as typescriptPlugin from '@graphql-codegen/typescript';
// import gql from "graphql-tag";
// import { type } from 'os';

const globby = require('globby');
// import { TypesGenerator } from './utils';
const { TypesGenerator } = require('./utils');


// const __dirname = path.resolve(path.dirname(''));

let dir = './sources/';
// let filename = 'queries.js';


/** @type {{ filename: string; files: any; target: string; }} */ 

module.exports = async function typesGenerate(
	/**
	 * @type {{ 
	 * 	filename: string; 
	 * 	files: string[]; 
	 * 	target: string; 
	 * 	separateFileForArgumentsTypes?: string,
	 * 	matchTypeNames: boolean,
	 * 	declarateSource: string[],
	 * 	declTemplate?: string,
	 * }} 
	 * 
	 */ options,
	) {
		
	// let typeConds = {
	// 	string: ['Name', 'Title', 'Date', 'Time'],
	// 	bool: ['is'],
	// 	number: ['Id']
	// } 	

	let graTypes = {};
	let codeTypes = '';
	
	options = Object.assign(
		{
			filename: 'queries.js',
			files: [],
			dirname: 'examples',
			target: 'queries.d.ts',
			/**
			 * use server types (for server generated queries)
			 */
			useServerTypes: true,
			/**
			 * attach `__typename` field for each query type
			 */
			attachTypeName: true,
			/**
			 * attach 'QueryTypes' type
			 */
			matchTypeNames: true,
			separateFileForArgumentsTypes: '',
			rules: {
				string: ['Name', 'Title', 'Date', 'Time'],
				bool: ['is'],
				number: ['Id']
			}
		},
		options || {}
	);

	const generator = new TypesGenerator(options)

	let filenames = options.filename ? [options.filename] : await globby(options.files || []);

	let declTemplate = ''
	if (options.declTemplate){
		declTemplate = fs.readFileSync(options.declTemplate, { encoding: 'utf8', flag: 'r' })
	}
	

	for (const filename of filenames) {
		
		// codeTypes = generator.getTypes(options.dirname + '/' + filename, codeTypes, graTypes);
		let _graTypes = {}
		let [declTypes, typesFromFile] = await generator.getTypes(filename, codeTypes, _graTypes);
		
		
		if (declTemplate && options.declarateSource?.includes(filename)){
			const declFile = filename.split('.').slice(0, -1).join('.') + '.d.ts';			

			fs.writeFile(
				declFile, 
				declTemplate + Object.entries(declTypes).map(
						([k,v]) => `\n${v.comment || ''}\nexport const ${k}: QueryString<'${v.typeName}'>;\n`
					)
					.join(''), 
				() => console.log(`>> Declaration success generated >> ${declFile}`));		
		}
		
		graTypes = {...graTypes, ..._graTypes};
		codeTypes = typesFromFile;
	}
	
	let target = options.target;  //options.filename.split('.').shift() + '.d.ts';

	let targetFile = path.join(process.cwd(), target);		// path.resolve(path.dirname(''))
	

	// generator.mutationArgs += 	"\n\nexport type QueryString<T extends string, Q extends string> = " +
	// 									"`\n    ${'mutation'|'query'} ${T} {\n        ${Q}${string}\`"


	// generator.mutationArgs += `\n\n\n${generator.argTypesCode}`
	generator.mutationArgs += `\n\n${generator.getArgumentMatchesType()}`

	if (options.matchTypeNames){
		codeTypes += '\n\n/*\n* `QueryTypes` - may be need for more flexible types management on client side \n*' +
					'\n* (optional: controlled by `matchTypeNames` option)\n*/\n'		
		codeTypes += `export type QueryTypes = {\n${Object.keys(graTypes).map(tn => `    ${tn}: ${tn}`).join('\n')}\n}\n`
	}

	if (options.separateFileForArgumentsTypes){
		
		fs.writeFile(targetFile, codeTypes, () => console.log(`\n\nQueries types generated to ${targetFile}!`));		

		const argsTargetFile = path.join(process.cwd(), options.separateFileForArgumentsTypes);
		fs.writeFile(
			argsTargetFile, generator.mutationArgs, () => console.log(`Arguments types generated to ${argsTargetFile}!`)
		);		
	}
	else fs.writeFile(
		targetFile, codeTypes + generator.mutationArgs, () => console.log(`\n\nOutputs generated to ${targetFile}!`)
	);	
	
}





