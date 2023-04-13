//@ts-check

// import { typesGenerate } from "./sources/main";
const path = require('path');
const typesGenerate = require('../sources/main');
// import { typesGenerate } from "./main";

const basePath = './examples'

const sourceFiles = [
	'./examples/real/queries.js',
	'./examples/real/mutations/auth.ts',	
]

async function main() {
	await typesGenerate({
		// filename: './examples/mutations.js',
		// filename: './examples/queries.js',
		
		declTemplate: './examples/template.d.ts',	
		
		// the same as files
		// filename: path.resolve(basePath, './queries/queries.js'),
		// filename: path.resolve(basePath, './real/queries.js'),
		filename: path.resolve(basePath, './real/autoqueries.js'),

		// generate types based on queries described at the following files:
		// files: [
		// 	...sourceFiles,
		// 	'./examples/real/autoqueries.js',			
		// ],
		// // generates d.ts with QueryString declarations to the following files:
		// declarateSource: sourceFiles,		


		// target: './examples/queries.ts',
		target: './examples/queries/queries.ts',
		
		// separate arguments types from response types:
		separateFileForArgumentsTypes: './examples/queries/arguments.ts',		
		
		attachTypeName: true		
	});	
}

main();