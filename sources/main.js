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
	/** @type {{ filename: string; files: string[]; target: string; separateFileForArgumentsTypes?: string}} */ options,
	) {
		
	// let typeConds = {
	// 	string: ['Name', 'Title', 'Date', 'Time'],
	// 	bool: ['is'],
	// 	number: ['Id']
	// } 	

	let graTypes = [];
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
	for (const filename of filenames) {
		
		// codeTypes = generator.getTypes(options.dirname + '/' + filename, codeTypes, graTypes);
		let typesFromFile = await generator.getTypes(filename, codeTypes, graTypes);
		codeTypes = typesFromFile;
	}
	
	let target = options.target;  //options.filename.split('.').shift() + '.d.ts';

	let targetFile = path.join(process.cwd(), target);		// path.resolve(path.dirname(''))
	

	// generator.mutationArgs += 	"\n\nexport type QueryString<T extends string, Q extends string> = " +
	// 									"`\n    ${'mutation'|'query'} ${T} {\n        ${Q}${string}\`"


	// generator.mutationArgs += `\n\n\n${generator.argTypesCode}`
	generator.mutationArgs += `\n\n${generator.getArgumentMatchesType()}`

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





