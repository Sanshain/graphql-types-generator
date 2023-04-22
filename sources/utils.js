//@ts-check

const fs = require('fs');
const http = require('http');
// const { execArgv } = require('process');

const { schemaQuery } = require('./utils/request')
const gql = require('graphql-tag');


const { rules, browserTypes, scalarTypes } = require('./utils/rules');

const { extractType } = require('./utils/extraction');




class TypesGenerator{

	/**
	 * @type {{[key: string]: object}?} - серверные типы с описанием
	 */
	serverTypes = null;

	/**
	 * @type {{name: string, type: string| null}[]}?} - стор соответствий подзапросов их серверным типам
	 */	
	serverSubTypes = [];
	/**
	 * @type {string[]} - список типов
	 */
	rootTypes = []

	
	argTypesCode = '';	
	argMatches = {}
	/**
	 * @type {string | any[]}
	 */
	argTypes = [];

	verbose = false;
	mutationArgs = '\n\n/* Mutation Arguments types:*/\n';

	/**
	 * @param {import('./main').BaseOptions} options
	 */
	constructor(options){
		
		let keyValidator = Object.keys(rules);
		
		if (options.rules) this.rules = { ...options.rules, ...rules}
		this.options = options;
		
		if (options.rules){
			if (!keyValidator.every(k => k in this.rules)){
				throw new Error('All base types are not defined (string, bool, number)');
			}
		}
	}


	/**
	 * добавляет сгенерированные типы в codeTypes и возвращает ее
	 * @param {string} filename - имя файла
	 * @param {string} codeTypes - типы тайпскрипт в виде объекта
	 * @param {object} graTypes - типы тайпскрипт в виде строк
	 * @returns {Promise<[Record<string, any>, string]>} typescript code
	 */
	async getTypes(filename, codeTypes, graTypes) {

		let declTypes = {}

		if (this.serverTypes === null) {
			try{
				await this.getSchemaTypes();		
			}
			catch(ex){
				this.serverTypes = {}
				console.warn(`Attention: graphql server unavalible! Types will be generated via field namings\n`);
			}
		}
		
		let gqlDefs = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
		// let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);
		let gqls = Array.from(
			// gqlDe.matchAll(/(\/\*[\s\S]+?\*\/)?\n?export (const|let) ([\w_\d]+)\s?= gql`([^`]*?)`/g),
			gqlDefs.matchAll(/(\/\*[\s\S]*?\*\/\r?\n)?export (?:const|let) ([\w_\d]+)\s?= gql`([^`]*?)`/g),
			// gqlDe.matchAll(
			// 	/(\/\*[\s\S]*?\*\/\r?\n)?export (?:const|let) ([\w_\d]+)\s?= gql`(\s*(?:query|mutation)\s*\w+\s*\{\s*(\w+)[^`]*?)`/gi
			// ),
			m => {
				return [m[1], m[2], m[3]]
			}
		)
		
		console.log(`\n# ${gqls.length} types detected in "${filename}": \n`);

		for (const [comment, queryName, query] of gqls) {

			try{				
				/**
				 * @type {import('graphql').OperationDefinitionNode} [DefinitionNode as OperationDefinitionNode]
				 */
				//@ts-expect-error
				var definition = gql.gql(query).definitions.pop()
				// var definition = gql.gql(query).definitions.slice(-1)[0]
			}
			catch(ex){
				console.warn('Detected wrong gql syntax. Check comments'); continue;
			}

			// console.log('-');

			const typeName = definition?.name?.value || 'undefined';
			if (typeName == 'undefined'){ 
				// TODO somethong with this one: (works fine, but what`s wrong?)
				this.options.debug && console.warn(`! >> ${queryName} definition name is not recognized`);
				continue;
			}
			typeName === 'undefined' && console.warn(`  ---> Warning: detected undefined query name in ${filename}`);

			typeName && console.log(typeName);

			// let serverType = Object.entries(this.serverTypes).find(([k, v]) => k == typeName)
			// if (serverType){
			// 	let selfType = serverType.pop()
			// 	selfType = Array.isArray(selfType) ? selfType[0] : selfType
			// 	// let typeString = `\n\nexport type ${typeName} = ` + JSON.stringify(selfType)
			// 	// 	.replace(/"/g, '').replace(/\:/g, ': ')  // .replace(/,/g, ', ')
			// 	// 	.replace(/,/g, ',\n    ').replace(/\{/g, '{\n    ').replace(/\}/g, '\n}')
			// 	// 	.replace(/null,/g, 'object[],')
			// 	// 	.replace(/(ID|Int)/g, 'number')
			// 	// 	.replace(/(Date|DateTime|String),/g, 'string,')
			// 	// 	.replace(/Boolean/g, 'boolean');

			// 	// codeTypes += typeString;
			// 	// graTypes.push(selfType);
			// 	continue
			// }
			
			/**
			 * @type {import('graphql').OperationDefinitionNode[]} [DefinitionNode as OperationDefinitionNode]
			 */			
			//@ts-expect-error
			let selections = definition?.selectionSet.selections;
						
			let serverType = Object.entries(this.serverTypes || {}).find(([k, v]) => k == typeName)
						
			let genType = extractType.call(this, selections, 0, serverType, null);
			if (this.options.attachTypeName){				
				
				//@ts-expect-error
				let argTypes = selections.map((s) => s.name.value)
												 .filter((/** @type {any} */ x) => this.argTypes.includes(x));				
				if (argTypes.length){
					this.argMatches[typeName] =  argTypes.map((/** @type {string} */ t) => t + 'Args').join(' & ');					
				}

				//TODO include as option:
				// if (this.options.matchTypeNames || argTypes.length){
				if (argTypes.length){
					genType.lines = `\n    __typename: "${typeName}",\n\n` + genType.lines
				}				
			}
			let typeString = `\n\nexport type ${typeName} = {\n${genType.lines}};`;

			codeTypes += typeString;
			graTypes[typeName] = genType;
			declTypes[queryName] = {typeName, comment};
		}

		return [declTypes, codeTypes];
	}

	getArgumentMatchesType() {

		let splitted = false;
		
		this.argTypesCode = Object.entries(this.argMatches).reduce(
			(accType, [typeName, argTypes], i) => {
				/// split it: 
				// (TODO reshape more optimum)
				if (i && !splitted && !this.argTypes[this.argTypes.indexOf(argTypes.slice(0, -4)) - 1]) {
					accType += '    \n'					// 
				}
				return accType += (`    ${typeName}: ${argTypes},\n`)
			}, 
			'export type ArgTypes = {\n    undefined: never,\n\n'
		) + '}'

		return this.argTypesCode;
	} 	



	/**
	 * @param {{ selectionSet: { selections: any[]; }; name: { value: string | number; }; }} selection
	 * @param {{ [x: string]: { [x: string]: any; }; }} _gpaType
	 * @param {string} _lines
	 */
	getServerType(selection, _gpaType, _lines) {

		let fields = selection.selectionSet.selections.map(f => f.name.value);
		let selectionType = (this.serverTypes || [])[selection.name?.value];
		let isArray = Array.isArray(selectionType);
		if (isArray)
			_gpaType[selection.name.value] = [];

		for (const field of fields) {
			if (!isArray) {
				// this.serverTypes[field.slice(0, -1)]
				let fieldType = selectionType[field];
				let tsType = browserTypes[fieldType] || fieldType.toLowerCase();
				_gpaType[field] = tsType;
				_lines += ' '.repeat(8) + `${field}:${tsType},\n`;
			}
			else {
				let fieldType = selectionType[0][field];
				let tsType = browserTypes[fieldType] || fieldType.toLowerCase();
				_gpaType[selection.name.value][field] = tsType;
				_lines += ' '.repeat(8) + `${field}:${tsType},\n`;
			}

		}
		return _lines;
	}

	async getSchemaTypes(){
		
		let serverTypes = {}		

		/** 
		 * @type {Awaited<ReturnType<TypesGenerator['typesRequest']>> }
		 * */
		let rawSchema = await this.typesRequest(schemaQuery);	
		this.rawSchema = rawSchema.data.__schema.types.filter(t => !t.name.startsWith('__'));
		let mutationTypes = this.rawSchema.find(t => t.name == 'Mutation')?.fields || [];

		this.mutationTypes = {}
		let argTypes = []
		const typeFromDescMark = this.options.typeFromDescMark || ':::';

		for (const mutation of mutationTypes) {	
			
			this.mutationTypes[mutation.name] = mutation;
			// TODO get fields from type name like `get output fields from server side` for queries below
			// via queryOrMutation.type?.name			

			this.genInputTypes(mutation, typeFromDescMark);
			argTypes.push(mutation.name);
		}

		this.argTypes = argTypes
		argTypes.push('')

		let rawQueries = this.rawQueries = this.rawSchema.find(t => t.name == 'Query')?.fields;
		for (let key in rawQueries)
		{
			const rawType = rawQueries[key];						
			let type = rawType.type.name || rawType.type.ofType?.name;	
			type = type || (rawType.name.endsWith('s') 				
				? rawQueries.find(t => t.name == rawType.name.slice(0, -1))?.type.name
				: 'unknown[]'
			);						

			if (type){

				/// try get output fields from server side:

				let tsType = {}
				for (const field of (this.rawSchema.find(t => type == t.name)?.fields || [])) {

					tsType[field.name] = field.type.name || field.type.ofType?.name;
					if (!~['Int', 'String', 'Boolean', 'ID', 'DateTime', 'Date'].indexOf(tsType[field.name])){
						const subType = this.rawSchema.find(w => w.name == tsType[field.name]);
						if (subType && subType.fields && subType.fields.length) {
							tsType[field.name] = {}
							for (const subField of subType.fields) {
								tsType[field.name][subField.name] = subField.type.name || subField.type.ofType?.name;
							}
						}
					}
					tsType[field.name] = tsType[field.name] || 'object[]';
					// tsType[type] = field.type.name || field.type.ofType.name;
				}

				// if (rawType.name == 'dialog'){
				// 	console.log(rawType.name);
				// }				
				// serverTypes[rawType.name] = rawType.type.name 
				// serverTypes[type] = rawType.type.kind !== 'LIST' // rawType.type.name 
				serverTypes[rawType.name] = rawType.type.kind !== 'LIST' // rawType.type.name 
					? tsType
					: [tsType]
				
				/// args: 

				if (rawType.args && rawType.args.length){
					
					this.genInputTypes(rawType, typeFromDescMark);
					argTypes.push(rawType.name);
				}

			}
		}

		// rawSchema.filter(t => ~Object.values(serverTypes).indexOf(t.name))
		
		this.verbose && console.log(rawSchema);

		this.serverTypes = serverTypes;
		//@ts-expect-error
		this.serverSubTypes = this.rawQueries.map(r => ({name: r.name, type: (r.type.name || r.type.ofType?.name)}))
	}


	/**
	 * @param {{ 
	 * 	name: string; 
	 * 	description: string | null; 									// string - for mutations, undefined - for queries
	 * 	args: Array<{name?: string, type?: {name: string}}>; 
	 * 	type?: { 
	 * 		fields?: unknown[] | undefined; 
	 * 		kind: "OBJECT" | "LIST" | "SCALAR" | "NOT_NULL" | "Field"; 
	 * 		name?: string | undefined;
	 * 		ofType?: { name: string; } | undefined; 
	 * 	};
	 *  }} queryOrMutation
	 * @param {string} typeFromDescMark
	 */
	genInputTypes(queryOrMutation, typeFromDescMark) {		

		let inputFields = queryOrMutation.args.map(param => [param.name, param.type?.name || 'any'])

		if (queryOrMutation.description && queryOrMutation.description.startsWith(typeFromDescMark)) {
			console.log(`Types for "${queryOrMutation.name}" mutation generates from server side description`);
			inputFields = queryOrMutation.description.substring(3).split('\n')
				.filter(item => item.trim())
				.map(item => item.trim().split(':'));
		}
		let typeDec = `export type ${queryOrMutation.name + 'Args'} = {\n    ` + inputFields
			.map(([k, v]) => `${k}: ${scalarTypes[('' + v).trim()] || (v || 'unknown').trim()}`)
			.join(',\n    ') + '\n}';
		this.mutationArgs += '\n' + typeDec + '\n';
		
		return inputFields;
	}

	/**
	 * @param {string} queriesInfoQuery
	 * @returns {Promise<import('./main').Schema>}
	 */
	typesRequest(queriesInfoQuery){			
				
		const reqOptions = typeof this.options.useServerTypes == 'object' ? this.options.useServerTypes : {}

		return new Promise(function(resolve, reject) {
			// Эта функция будет вызвана автоматически
		 
			let data = ''
			const options = {		
				hostname: reqOptions.host || '127.0.0.1',
				port: reqOptions.port || 8000,
				path: '/graphql',
				method: 'POST',		
				headers: {'Content-Type': 'application/json'}
			}
			
			const request = http.request(options, (response) => {
			
				console.log(`statusCode: ${response.statusCode}`)
				response.on('data', (d) => data += d.toString());					
				response.on('end', () => resolve(JSON.parse(data)));	
			})
			
			request.on('error', e => reject(e));	 
			request.write(JSON.stringify({query: queriesInfoQuery || this.queriesInfoQuery}))
			request.end()
			// В ней можно делать любые асинхронные операции,
			// А когда они завершатся — нужно вызвать одно из:
			// resolve(результат) при успешном выполнении
			// reject(ошибка) при ошибке
		});

	}

}

module.exports = {
	TypesGenerator
}

/**
 * @typedef {TypesGenerator} TypesBuilder
 */