//@ts-check
import { codegen } from '@graphql-codegen/core';
import { loadSchemaSync, loadDocuments, loadTypedefsSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { buildSchema, printSchema as graphqlToString, parse, GraphQLSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';
import * as typescriptPlugin from '@graphql-codegen/typescript';


const __dirname = path.resolve(path.dirname(''));

// let gqlDe = fs.readFileSync('./sources/queries.js', {encoding:'utf8', flag:'r'});
// let gqls = gqlDe.matchAll(/gql`[^`]*?`/g);

// :GraphQLSchema
// const schema = buildSchema(`type A { name: String }`);

// https://www.graphql-tools.com/docs/schema-loading/
const schema = loadTypedefsSync('./sources/queries.js', {
	loaders: [new GraphQLFileLoader()]
});
const outputFile = './sources/graphql-types.d.ts';
const config = {
  documents: [],
  config: {},
  // used by a plugin internally, although the 'typescript' plugin currently
  // returns the string output, rather than writing to a file
  filename: outputFile,
  schema: parse(graphqlToString(schema)), 
  plugins: [ // Each plugin should be an object
    {
      typescript: {}, // Here you can pass configuration to the plugin
    },
  ],
  pluginMap: {
    typescript: typescriptPlugin,
  },
};

export async function generateTypes(schema){

	config.schema = schema || config.schema;
	const output = await codegen(config);

	fs.writeFile(path.join(__dirname, outputFile), output, () => {
	  console.log('Outputs generated!');
	});
}

generateTypes();