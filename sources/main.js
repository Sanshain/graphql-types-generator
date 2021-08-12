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


/** @type {{ filename: any; files: any; target: any; }} */ 
module.exports = async function typesGenerate(options) {

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
		codeTypes = await generator.getTypes(filename, codeTypes, graTypes);
	}
	
	let target = options.target;  //options.filename.split('.').shift() + '.d.ts';

	let targetFile = path.join(process.cwd(), target);		// path.resolve(path.dirname(''))

	fs.writeFile(targetFile, codeTypes, () => {
		
		console.log(`Outputs generated to ${targetFile}!`);
	});
	
}





