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
// const glob = require("glob")
// import { TypesGenerator } from './utils';
const { TypesGenerator } = require('./utils');
const { unknownTypes } = require('./utils/extraction');


// const __dirname = path.resolve(path.dirname(''));

let dir = './sources/';
// let filename = 'queries.js';


/** @type {{ filename: string; files: any; target: string; }} */ 

module.exports = async function typesGenerate(
	/**
	 * @type {import('./main').BaseOptions} 
	 */ 
	 options
	) {
		
	// let typeConds = {
	// 	string: ['Name', 'Title', 'Date', 'Time'],
	// 	bool: ['is'],
	// 	number: ['Id']
	// } 	

	let graphTypes = {};
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

	options.screentypes = options.screentypes === undefined ? false : options.screentypes;

	const generator = new TypesGenerator(options)

	options.files = options.filename ? options.files?.concat([options.filename]) : options.files

	let filenames = options.files 
		? await ((async () => {
		
			let arr = [];
			//@ts-expect-error
			for (const file of options.files) {
				let _files = await globby([file]);
				arr = arr.concat(_files.length ? _files : [file])
			}
			return arr;		
		})())
		: [options.filename] 
		// : await ((() => {
			
		// 	let arr = [];
		// 	for (const files of options.files) {
		// 		glob(files, {}, function(er, _files){
		// 			arr.push(..._files)
		// 		})
		// 	}
		// 	return Promise.resolve(arr);
		// })())
	
	
	// await globby(options.files || []);

	let declTemplate = ''
	if (options.declTemplate){
		declTemplate = fs.readFileSync(options.declTemplate, { encoding: 'utf8', flag: 'r' })
	}


	for (const filename of filenames) {
		
		// codeTypes = generator.getTypes(options.dirname + '/' + filename, codeTypes, graTypes);
		let _graphTypesInfo = {}
		let [declTypes, typesFromFile] = await generator.getTypes(
			filename, codeTypes, _graphTypesInfo,
		);
		
		generator.existingTypes = [...generator.existingTypes, ...Object.keys(declTypes)]
		
		if (options.declarateSource?.includes(filename)){
			const declFile = filename.split('.').slice(0, -1).join('.') + '.d.ts';			

			let declContent = ''
			if (options.matchTypeNames) {
				declContent = declTemplate + Object.entries(declTypes).map(
					([k,v]) => `\n${v.comment || ''}\nexport const ${k}: QueryString<'${v.typeName}'>;\n`
				).join('')				
			}
			else if (Array.isArray(generator.argTypes)){
				// generate imports
				const typesWithArgs = Array.from(new Set(generator.argTypes.filter(Boolean))).map(a => a + 'Args');
				const argsFile = path.relative(path.dirname(declFile), options.separateFileForArgumentsTypes || options.target)
					.replace(/\\/g, '/')
					.replace(/(.d)?.ts$/gm, '');

				const argsImports = `import {\n\t${typesWithArgs.join(',\n\t')} \n} from '${argsFile}'`

				const typeNames = Object.values(declTypes).map(f => f.typeName);
				const typesFile = path.relative(path.dirname(declFile), options.target)
					.replace(/\\/g, '/')
					.replace(/(.d)?.ts$/gm, '');												
					
				const typesImports = `import { ${typeNames.join(', ')} } from '${typesFile}'`

				const uniqueKeyArgs = `export declare const queryArgs: unique symbol\n`
				const uniqueKeyType = `export declare const queryType: unique symbol\n`
				
				declContent = typesImports + '\n\n' + argsImports + '\n\n' + '\n\n\n' + uniqueKeyArgs + uniqueKeyType
				declContent += "type QueryString<T, A=never> = `\n    ${'mutation'|'query'} ${string}`" + 
					" & {[queryArgs]?: A}" +
					" & {[queryType]?: T}\n\n" 

				declContent += Object.entries(declTypes).map(
					([k,v]) => {
						const args = ~typesWithArgs.indexOf(v + 'Args') ? `, ${v}Args` : ''
						return `\n${v.comment || ''}\nexport const ${k}: QueryString<${v.typeName}${args}>;\n`
					}
				).join('')
			}
			else{
				debugger
			}
			
			fs.writeFile(
				declFile, declContent, () => console.log(
					`>> Declaration success generated >> ${'\x1b[34m'}${declFile}${resetColor}`
				)
			);
		}
		
		graphTypes = {...graphTypes, ..._graphTypesInfo};
		codeTypes = typesFromFile;
	}
	
	let target = options.target;  //options.filename.split('.').shift() + '.d.ts';

	let targetFile = path.join(process.cwd(), target || '');		// path.resolve(path.dirname(''))
	

	// generator.mutationArgs += 	"\n\nexport type QueryString<T extends string, Q extends string> = " +
	// 									"`\n    ${'mutation'|'query'} ${T} {\n        ${Q}${string}\`"


	// generator.mutationArgs += `\n\n\n${generator.argTypesCode}`

	if (options.matchTypeNames){
		generator.mutationArgs += `\n\n${generator.getArgumentMatchesType()}`
	}	

	if (options.matchTypeNames){
		codeTypes += '\n\n/*\n* `QueryTypes` - may be need for more flexible types management on client side \n*' +
					'\n* (optional: controlled by `matchTypeNames` option)\n*/\n'		
		codeTypes += `export type QueryTypes = {\n${Object.keys(graphTypes).map(tn => `    ${tn}: ${tn}`).join('\n')}\n}\n`
	}

	if (options.screentypes === true){

		options.screentypes = fs.readFileSync(path.join(__dirname, './templates/screentypes.ts')).toString() + '\n\n'
		
		const installedLib = 'node_modules/graphql-types-generator';
		if (fs.existsSync(path.join(process.cwd(), `${installedLib}/sources/templates/screentypes.ts`))){
			options.screentypes = `import "${installedLib}/sources/templates/screentypes"`;
		}
		else if(fs.existsSync(path.join(process.cwd(), `sources/templates/screentypes.ts`))){
			options.screentypes = `import "../../sources/templates/screentypes"`
		}
		
		options.screentypes += '\n\n' + Object.values(unknownTypes).join('\n') + '\n\n'

	}
	else if(options.screentypes === false){
		options.screentypes = ''						// disable (look up TypesGen constructor)
	}
	else if (typeof options.screentypes === 'object'){
		options.screentypes = ''						// the same as next
	}
	else if(options.screentypes === ''){
		// keep branded types in output code w/o attached declaration 
		// implies that user will define it in global
	}

	codeTypes = options.screentypes + codeTypes;		

	const foreColor = "\x1b[32m"
	const resetColor = "\x1b[0m"

	if (options.separateFileForArgumentsTypes){
		
		if (options.screentypes && options.verbose){
			console.warn('\x1b[35m' +
				'with `separateFileForArgumentsTypes` and `options.branded` both we recommend set `options.branded` to ' +
				'\'\' and redefine the appropriate branded types in global type space (or link include tsconfig option ' +
				'to `node_modules/graphql-types-generator/sources/templates/screentypes.ts)`' + '\x1b[0m'
			)
			// or /// <reference lib="node_modules/graphql-types-generator/sources/templates/screentypes" />
		}

		fs.writeFileSync(targetFile, codeTypes);					

		console.log(`\nQueries types generated to ${foreColor}${targetFile}${"\x1b[0m"}!`);


		const argsTargetFile = path.join(process.cwd(), options.separateFileForArgumentsTypes);		
		options.screentypes = options.screentypes ? ('/* Screen types: */\n\n' + options.screentypes) : ''
		
		fs.writeFileSync(
			argsTargetFile,
			options.screentypes + generator.mutationArgs
		);		

		console.log(`Arguments types generated to ${foreColor}${argsTargetFile}${"\x1b[0m"}!`)
	}
	else fs.writeFile(
		targetFile, codeTypes + generator.mutationArgs, () => {
			console.log(`\n\nOutputs generated to ${foreColor}${targetFile}${"\x1b[0m"}!`)
		}
	);		
}





