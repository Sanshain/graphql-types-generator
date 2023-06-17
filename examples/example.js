//@ts-check


// import { typesGenerate } from "./sources/main";
const path = require('path');
const typesGenerate = require('../sources/main');
// import { typesGenerate } from "./main";

const basePath = './examples'

const sourceFiles = [
	'./examples/sources2/queries.js',
	'./examples/sources2/mutations/auth.ts',	
]

async function main() {
	await typesGenerate({
		
		declTemplate: './examples/template.d.ts',	
		
		
		// filename: path.resolve(basePath, './sources1/queries.js'),		// the same as files

		/// OR generate types based on queries described at the following files:
		
		filename: path.resolve(basePath, './sources2/autoqueries.js'),
		files: [
			...sourceFiles,
			'./examples/sources2/autoqueries.js',			
		],
		

		// declarateSource: sourceFiles,			// generates d.ts with QueryString declarations to the following files:
		target: './examples/target/queries.ts',
		separateFileForArgumentsTypes: './examples/target/arguments.ts',	// separate arguments types from response types
		attachTypeName: true,
		branded: true,

		
		debug: true,									// output optional verbose info to termanal
	});	
}

main();