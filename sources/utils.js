//@ts-check

const fs = require('fs');
const http = require('http');
// const { execArgv } = require('process');

const { schemaQuery } = require('./utils/request')
const gql = require('graphql-tag');


const { rules, browserTypes, scalarTypes, brandedTypes, forceRequireTypes: forced } = require('./utils/rules');

const { generateTypeFromRules, unknownTypeApply } = require('./utils/extraction');
const { extractType } = require('./utils/extraction');




class TypesGenerator{

	/**
	 * @type {{[key: string]: object}?} - серверные типы с описанием
	 */
	serverTypes = null;
	
	scalarTypes = scalarTypes;

	/**
	 * @type {{name: string, type: string| null}[]}?} - стор соответствий подзапросов их серверным типам
	 */	
	serverSubTypes = [];
	/**
	 * @type {string[]} - список типов
	 */
	rootTypes = []
	/**
	 * @type {string[]}
	 */
	existingTypes = []

	
	argTypesCode = '';	
	argMatches = {}
	/**
	 * @desc 
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

		if (options.screentypes === true || typeof options.screentypes === 'string' /* '' */){
			this.scalarTypes = {...scalarTypes, ...brandedTypes};
		}
		else if (typeof options.screentypes === 'object'){
			this.scalarTypes = {...scalarTypes, ...options.screentypes};
		}
		else if (options.screentypes === false){
			// this.scalarTypes = scalarTypes;
		}
		this.options = options;
		
		if (options.rules){
			if (!keyValidator.every(k => k in rules)){
				throw new Error('All base types are not defined (string, bool, number)');
			}
		}
	}


	/**
	 * добавляет сгенерированные типы в codeTypes и возвращает ее
	 * @param {string} filename - имя файла
	 * @param {string} codeTypes - типы тайпскрипт в виде объекта
	 * @param {object} _graphTypes - типы тайпскрипт в виде строк
	 * @returns {Promise<[Record<string, any>, string]>} typescript code
	 */
	async getTypes(filename, codeTypes, _graphTypes) {

		const declTypes = {}

		let gqlDefs = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
		// let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);
		let gqls = Array.from(
			// gqlDe.matchAll(/(\/\*[\s\S]+?\*\/)?\n?export (const|let) ([\w_\d]+)\s?= gql`([^`]*?)`/g),
			gqlDefs.matchAll(/(\/\*[\s\S]*?\*\/\r?\n)?^export (?:const|let) ([\w_\d]+)\s?= gql`([^`]*?)`/gm),
			// gqlDe.matchAll(
			// 	/(\/\*[\s\S]*?\*\/\r?\n)?export (?:const|let) ([\w_\d]+)\s?= gql`(\s*(?:query|mutation)\s*\w+\s*\{\s*(\w+)[^`]*?)`/gi
			// ),
			m => {
				return [m[1], m[2], m[3]]
			}
		)		

		if (this.serverTypes === null) {
			try{
				this.serverTypes = await this.getSchemaTypes();		
			}
			catch(ex){
				this.serverTypes = {}
				console.warn(`Attention: graphql server unavalible! Types will be generated via field namings\n`);
			}
		}	
		
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
				if (ex.message === 'Syntax Error: Cannot parse the unexpected character "/".'){
					console.warn(`Detected wrong gql syntax with slash on ${queryName}`);
				}
				else{
					console.warn(`Detected wrong gql syntax: '${ex.message}' on ${queryName}`);
				}				
				 continue;
			}

			// console.log('-');

			const typeName = definition?.name?.value || 'undefined';
			if (typeName == 'undefined'){ 
				// TODO somethong with this one: (works fine, but what`s wrong?)
				(this.options.debug || this.options.verbose) && console.warn("\x1b[33m",
					`! >> ${queryName} definition name is not recognized`,
				"\x1b[0m");
				// this.options.verbose && console.warn(`  ---> Warning: detected undefined query name in ${filename}`)
				continue;
			}

			typeName && console.log("\x1b[36m", typeName, "\x1b[0m");

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
				
			// this.rawSchema.find(tp => tp.name === typeName).fields.reduce((acc, field) => ({...acc, [field.name]: scalarTypes[field.type.name] || field.type.name}), {})			

			let genType = extractType.call(this, selections, 0, null, serverType);
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
			_graphTypes[typeName] = genType;
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
	 * @param {string} name
	 */
	_isPlural(name){
		return name.slice(-1) == 's' || name.slice(-3) === 'Set'
	}

	/**
	 * @description generate text representation of ts type and fill _gpaphType appropriate type fields
	 * based on server query types and selection: extract from server types only types existsing in selection
	 * 
	 * @param {{selectionSet: {selections: readonly any[];};name?: {value: string | number;};}} selection
	 * @param {{[x: string]: {[x: string]: any;};}} _gpaphType - link to foreign object with type fields
	 * @param {number} offset - offset for lines formatting
	 * @param {string} _lines
	 */
	getServerType(selection, _gpaphType, _lines, offset) {

		const selectionName = selection.name?.value;
		if (!selectionName) return ''

		const serverType = (this.serverTypes || [])[selectionName] 
		const isArrayType = Array.isArray(serverType);
		const selectedFields = selection.selectionSet.selections.map(f => ({
			name: f.name.value, 
			selection: f.selectionSet ? f: undefined
		}));
				
		
		if (isArrayType) _gpaphType[selectionName] = [];
		const self = this;

		for (const field of selectedFields) {
			
			const fieldType = isArrayType ? serverType[0][field.name] : serverType[field.name];
			const baseIndent = ' '.repeat(offset)

			if (!field.selection){											//  && typeof fieldType === 'string'				
				var tsType =  scalarTypes[fieldType] || 'unknown'  // // this.serverTypes[field.slice(0, -1)]
				if (tsType === 'unknown'){
					if (typeof fieldType === 'string') tsType = unknownTypeApply(this.options, fieldType);
					else{
						console.warn('\x1b[31m', '>> Wrong gql query: ',
							`field '${selectionName}.${field.name}' must have selection of subfields`,
						'\x1b[0m');
						tsType = 'unknown';
						// const fields = Object.entries(fieldType).map(
						// 	([k, tp]) => `${k}: ${scalarTypes[tp] || ('any' + (self._isPlural(k) ? '[]' : ''))}`
						// ).join('; ')
						// tsType = `{${fields}}`;
					}
				}
				_lines += baseIndent + `${field.name}: ${tsType},\n`;
			}
			else if (typeof fieldType === 'object'){		
				if (fieldType.edges == 'MessagesTypeEdge')	{
					debugger
				}		
				tsType = getSubType(field.selection, fieldType);			
				
				_lines += baseIndent + `${field.name}: {\n${toLines(tsType, offset + 4).join('\n')}\n${baseIndent}},\n`
			}
			else if(typeof fieldType == 'string' && fieldType !== 'object[]'){

				tsType = extractSubType(field.selection, fieldType)
				
				_lines += baseIndent + `${field.name}: {\n${toLines(tsType, offset + 4).join('\n')}\n${baseIndent}}[],\n`
			}
			else if(fieldType === 'object[]'){
				tsType = generateSubType(field.selection); console.warn(`Cann't detect server type for ${selectionName}.${field.name}`)

				_lines += baseIndent + `${field.name}: {\n${toLines(tsType, offset + 4).join('\n')}\n${baseIndent}},\n`								
			}
			else{
				debugger
			}

			if (isArrayType) _gpaphType[selectionName][field.name] = tsType;				
			else _gpaphType[field.name] = tsType;

			// _lines += ' '.repeat(8) + `${field.name}: ${tsType},\n`;

		}
		return _lines;


		/// @utility functions:


		/**
		 * @param {{selectionSet: {selections: any[]}}} field
		 * @returns {object}
		 */
		 function generateSubType(field) {
			const subFields = field.selectionSet.selections.map(f => ({
				name: f.name.value,
				selection: f.selectionSet ? f: undefined
			}));
			const _fields = subFields.reduce(function(/** @type {{ [x: string]: any; }} */ acc, subField) {
				acc[subField.name] = subField.selection
						? generateSubType(subField.selection)
						: generateTypeFromRules(subField.name)
				return acc;
			}, {});
			return _fields;
		}
		
		
		/**
		 * @description 
		 * @param {{selectionSet: {selections: any[]}}} field
		 * @param {{ [x: string]: string | object; }} fieldType
		 * @returns {object}
		 */
		function getSubType(field, fieldType) {
			const declaredFields = field.selectionSet.selections.map(f => ({
				name: f.name.value,
				selection: f.selectionSet ? f: undefined
			}));
			const _fields = declaredFields.reduce(function(/** @type {{ [x: string]: any; }} */ acc, subField) {
				if (fieldType === null || subField.name == 'node'){
					debugger
				}
				acc[subField.name] = typeof fieldType[subField.name] === 'string'
						? (scalarTypes[fieldType[subField.name]] || extractSubType(subField.selection, fieldType[subField.name]))
						: getSubType(subField.selection, fieldType[subField.name])
				return acc;
			}, {});
			return _fields;
		}


		/**
		 * @param {{selectionSet: {selections: any[];};}} selection
		 * @param {string} fieldType
		 */
		function extractSubType(selection, fieldType) {				

			const fieldTypeName = ~fieldType.indexOf('[]') ? fieldType.slice(0, -2) : fieldType;

			const graphType = self.rawSchema?.find(tp => tp.name == fieldTypeName)
			const subFields = graphType?.fields?.reduce((acc, f) => {
				let r = f.type.name || f.type.ofType?.name || f.type.ofType?.ofType?.ofType?.name;
				return {
					[f.name]: f.type.name || f.type.ofType?.name || f.type.ofType?.ofType?.ofType?.name,
					...acc
				}
			}, {})
			if (!subFields){
				return 'Object[]'
			}			

			const declaredFields = selection.selectionSet.selections.map(f => ({
				name: f.name.value,
				selection: f.selectionSet ? f: undefined
			}));
			
			const _fields = declaredFields.reduce(function(/** @type {{ [x: string]: any; }} */ acc, subField) {
				const fieldType = subFields[subField.name]
				acc[subField.name] = scalarTypes[fieldType] && !subField.selection
						? scalarTypes[fieldType]
						: extractSubType(subField.selection, fieldType)
				return acc;
			}, {});
			return _fields;
		}		

		/**
		 * @param {{ [x: string]: any; }} _tsType
		 * @param {number} _offset
		 * @return {string[]}
		 */
		function toLines(_tsType, _offset){
			return Object.keys(_tsType).map(function(key){
				if (typeof _tsType[key] == 'string'){
					return ' '.repeat(_offset) + `${key}: ${_tsType[key]},`;
				}
				else if(_tsType[key]){			
					const indent = ' '.repeat(_offset)				
					return `${indent}${key}: {\n${toLines(_tsType[key], _offset + 4).join('\n')}\n${indent}}`
				}
				else{
					
					return ' '.repeat(_offset) + `${key}: unexpected,`;
				}
			})
		}		
	}

	/**
	 * @description 
	 * - extract query type names to array with appropriate attached native graphql type name (this.serverSubTypes)
	 * - attach fields graphql kind types to query types (this.serverTypes) from the native graphql types
	 */
	async getSchemaTypes(){
		
		let serverTypes = {}		

		if (!this.rawSchema){
			/** 
			 * @type {Awaited<ReturnType<TypesGenerator['typesRequest']>> }
			 * */
			let rawSchema = await this.typesRequest(schemaQuery);	
			this.rawSchema = rawSchema.data.__schema.types.filter(t => !t.name.startsWith('__'));
		}
		let mutationTypes = this.rawSchema.find(t => t.name == 'Mutation')?.fields || [];

		this.mutationTypes = {}
		let argTypes = []
		const typeFromDescMark = this.options.typeFromDescMark || ':::';

		for (const mutation of mutationTypes) {	
			
			this.mutationTypes[mutation.name] = mutation;
			// const mutationTypeFields = ''
			
			// TODO get fields from type name like `get output fields from server side` for queries below
			// via queryOrMutation.type?.name			

			// this.attachInputTypes(mutation, typeFromDescMark);
			argTypes.push(mutation.name);
		}

		this.argTypes = argTypes
		argTypes.push('')							// mutations and queries params delimiter

		let rawQueries = this.rawQueries = this.rawSchema.find(t => t.name == 'Query')?.fields?.concat(mutationTypes);
		for (let rawType of rawQueries || [])
		{
			let type = rawType.type.name 
				|| rawType.type.ofType?.name 
				|| rawType.type.ofType?.ofType?.name 
			type = type || (rawType.type.kind === 'LIST' && rawType.name.endsWith('s')
					? rawQueries?.find(t => t.name == rawType.name.slice(0, -1))?.type.name
					: 'unknown[]');

			if (type){

				/// try get output fields from server side:

				let tsType = {}
				const typeFields = this.rawSchema.find(t => type == t.name)?.fields;
				for (const field of (typeFields || [])) {

					tsType[field.name] = field.type.name || field.type.ofType?.name 
					if (!tsType[field.name]){						
						// tsType[field.name] = field.type.ofType?.ofType?.ofType?.name 
						// console.log(`**${field.name}`);
					}
					if (!~['Int', 'String', 'Boolean', 'ID', 'DateTime', 'Date'].indexOf(tsType[field.name])){
						const subType = this.rawSchema.find(w => w.name == tsType[field.name]);
						if (subType && subType.fields && subType.fields.length) {
							tsType[field.name] = {}
							for (const subField of subType.fields) {
								tsType[field.name][subField.name] = subField.type.name || subField.type.ofType?.name;
								if (tsType[field.name][subField.name] === null){
									// to relay support: 
									tsType[field.name][subField.name] = subField.type.ofType?.ofType?.name;
									if (!tsType[field.name][subField.name]){
										// debugger
									}
								}
							}
						}
					}
					
					if (!tsType[field.name]) {						
						const foreignType = field.type.ofType?.ofType?.ofType?.name;
						if (foreignType) tsType[field.name] = foreignType + '[]'
						else{
							tsType[field.name] = 'object[]'
						}
					}
					// tsType[type] = field.type.name || field.type.ofType.name;
				}

				// if (rawType.name == 'dialog'){
				// 	console.log(rawType.name);
				// }				
				// serverTypes[rawType.name] = rawType.type.name 
				// serverTypes[type] = rawType.type.kind !== 'LIST' // rawType.type.name 
				serverTypes[rawType.name] = rawType.type.kind === 'LIST' // rawType.type.name 
					? [tsType]
					: tsType
				
				/// args: 

				if (rawType.args && rawType.args.length){
					
					this.attachInputTypes(rawType, typeFromDescMark);
					argTypes.push(rawType.name);
				}

			}
			else{
				// rawQueries.map(k => ({[k.name]: k.type.name, type: k.type.kind, fields: k.type.fields}))
				// => all lists: type.name is null, type.fields is null, type.ofType[name, fields] is null
				// const typeFields = type 
				// 	? this.rawSchema.find(t => type == t.name)?.fields
				// 	: rawType.type.fields		
				debugger		
			}
		}

		// rawSchema.filter(t => ~Object.values(serverTypes).indexOf(t.name))
		
		this.verbose && console.log(this.rawSchema);

		this.serverTypes = serverTypes;
		//@ts-expect-error
		this.serverSubTypes = this.rawQueries.map(r => ({name: r.name, type: (r.type.name || r.type.ofType?.name)}))

		return this.serverTypes
	}


	/**
	 * @param {{ 
	 * 	name: string; 
	 * 	description: string | null; 									// string - for mutations, undefined - for queries
	 * 	args: Array<{name?: string, type?: {name: string, ofType?: {name: string}}}>; 
	 * 	type?: { 
	 * 		fields?: unknown[] | undefined; 
	 * 		kind: "OBJECT" | "LIST" | "SCALAR" | "NOT_NULL" | "Field"; 
	 * 		name?: string | undefined;
	 * 		ofType?: { name: string; } | undefined; 
	 * 	};
	 *  }} queryOrMutation
	 * @param {string} typeFromDescMark
	 */
	attachInputTypes(queryOrMutation, typeFromDescMark) {

		
		// TODO logic: if a nested object...
		let described = false;
		 
		const isNestedType = (!this.options.preventOptionalParams && queryOrMutation.args?.length == 1) 
			? !this.scalarTypes[queryOrMutation.args[0].type?.name || queryOrMutation.args[0].type?.ofType?.name || '']
			: false


		let inputFields = queryOrMutation.args.map(param => [
			param.name, param.type?.name || param.type?.ofType?.name || 'any'
		])

		if (queryOrMutation.description && queryOrMutation.description.startsWith(typeFromDescMark)) {
			if (this.options.verbose){
				console.log(`Types for "${queryOrMutation.name}" mutation generates from server side description`);
			}
			inputFields = queryOrMutation.description.substring(3).split('\n')
				.filter(item => item.trim())
				.map(item => item.trim().split(':'));

			// described = true;
		}

		const self = this;
		let typeDec = `export type ${queryOrMutation.name + 'Args'} = {\n    ` + inputFields
			.map(([k, v], i) => {
				const typeName = (v + '').trim() || ''
				// const optional = (!~typeName.indexOf('!') && !~forceRequireTypes.indexOf(typeName)) ? '?' : ''
				// const optional = (described && !~typeName.indexOf('!') ) ? '?' : ''
				// const optional = (isNestedType && !~typeName.indexOf('!') && !~forced.indexOf(typeName)) ? '?' : ''
				const optional = (isNestedType && i && !~typeName.indexOf('!')) ? 'null | ' : ''
				if (optional){
					// console.log('ok');
				}
				return `${k}: ${optional}${self.scalarTypes[typeName] || (typeName || 'unknown').trim()}`
			})
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