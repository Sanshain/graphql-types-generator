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

const any = 'any';
const __dirname = path.resolve(path.dirname(''));

let dir = './sources/';
let filename = 'queries.js';

let gqlDe = fs.readFileSync(dir + filename, {encoding:'utf8', flag:'r'});
let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);

let graTypes = [];
let codeTypes = '';


let typeConds = {
	string: ['Name', 'Title', 'Date', 'Time'],
	bool: ['is'],
	number: ['Id']
}


for (const query of gqls) {	

	// @ts-ignore
	let definition  = gql(query).definitions.pop();

	const typeName = definition.name?.value || 'undefined';
	let selections = definition.selectionSet.selections


	function getType(selections, deep) {

		let _gpaType = {};	
		let lines = ''

		deep = (deep || 0) + 4;
		
		for (const selection of selections) {
		
			if (selection.selectionSet){
					
				let {_gpaType, lines: _lines} = getType(
					selection.selectionSet.selections, deep
					// selection.selectionSet.selections, deep + 4
				);

				_gpaType[selection.name.value] = _gpaType;	
				// const offset = ' '.repeat(deep + 4);			

				let value = `{\n${_lines}${' '.repeat(deep)}}`;		
				let values = null;				

				if (selection.name.value.slice(-1) === 's')		{
					if (deep % 8 === 0) values = `${value}[]`;
					else{
						values = `Array<${value}>`;
					}
				}
				// let values = `[\n${offset}{\n${_lines}${offset}}\n${' '.repeat(deep)}]`;
				lines += ' '.repeat(deep) + selection.name.value + `: ${values || value},\n`
			}
			else {

				const fieldName =  selection.name.value;

				let gType = any;
				if (typeConds.number.some(m => fieldName.endsWith(m) || m.toLowerCase() === fieldName)){
					gType = 'number'
				}
				if (typeConds.string.some(m => fieldName.startsWith(m.toLowerCase()) || fieldName.endsWith(m))){
					gType = 'string'
				}
				else if(typeConds.bool.some(m => selection.name.value.startsWith(m))){
					gType = 'boolean'
				}

				_gpaType[selection.name.value] = gType;

				lines += ' '.repeat(deep) + selection.name.value + `: ${gType},\n`
			}
		}
	
		return {_gpaType, lines};

	}

	let gpaType = getType(selections)

	let typeString = `\n\nexport type ${typeName} = {\n${gpaType.lines}};`;

	codeTypes += typeString;
	graTypes.push(gpaType);
}

filename = filename.split('.').shift() + '.d.ts';



fs.writeFile(path.join(__dirname, 'sources/' + filename), codeTypes, () => {
	console.log('Outputs generated!');
});





// :GraphQLSchema
// const schema = buildSchema(`type A { name: String }`);
// const schema = buildSchema(`type A { name: String }`);

// // https://www.graphql-tools.com/docs/schema-loading/
// const outputFile = './sources/graphql-types.d.ts';
// const config = {
//   documents: [],
//   config: {},
//   // used by a plugin internally, although the 'typescript' plugin currently
//   // returns the string output, rather than writing to a file
//   filename: outputFile,
//   schema: parse(graphqlToString(schema)), 
//   plugins: [ // Each plugin should be an object
//     {
//       typescript: {}, // Here you can pass configuration to the plugin
//     },
//   ],
//   pluginMap: {
//     typescript: typescriptPlugin,
//   },
// };

// export async function generateTypes(schema){

// 	config.schema = schema || config.schema;
// 	const output = await codegen(config);

// 	fs.writeFile(path.join(__dirname, outputFile), output, () => {
// 	  console.log('Outputs generated!');
// 	});
// }

// generateTypes();