//@ts-check
import { codegen } from '@graphql-codegen/core';
import { loadSchemaSync, loadDocuments, loadTypedefsSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { buildSchema, printSchema as graphqlToString, parse, GraphQLSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import gql from "graphql-tag";
import { type } from 'os';

import globby from 'globby';
import { TypesGenerator } from './utils';


const __dirname = path.resolve(path.dirname(''));

let dir = './sources/';
let filename = 'queries.js';

export async function typesGenerate(options) {

	// let typeConds = {
	// 	string: ['Name', 'Title', 'Date', 'Time'],
	// 	bool: ['is'],
	// 	number: ['Id']
	// } 	

	let graTypes = [];
	let codeTypes = '';

	options = options || {
		filename: 'queries.js',
		dirname: 'examples',
		target: 'queries.d.ts',
		rules: {
			string: ['Name', 'Title', 'Date', 'Time'],
			bool: ['is'],
			number: ['Id']
		}
	};

	const generator = new TypesGenerator(options)

	let filenames = options.filename ? [options.filename] : await globby(options.files || []);
	for (const filename of filenames) {
		
		codeTypes = generator.getTypes(dir + filename, codeTypes, graTypes);
	}
	
	let target = options.target;  //options.filename.split('.').shift() + '.d.ts';

	fs.writeFile(path.join(__dirname, `${options.dirname || '.'}/${target}`), codeTypes, () => {
		console.log('Outputs generated!');
	});
	
}





