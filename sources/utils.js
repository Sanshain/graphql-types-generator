//@ts-check

const gql = require('graphql-tag');
const fs = require('fs');
const http = require('http');


const any = 'any';


class TypesGenerator{

	serverTypes = null;
	argTypes = '';
	verbose = true;
	mutationArgs = '\n\n/* Mutation Arguments types:*/\n';

	/// for server approach 
	patterns = {
		ID: 'number',
		DateTime: 'Date | string',
		JSONString: 'File[] | object',
		null: 'any',
	}

	/// for naming approach 
	rules = {
		string: ['Name', 'Title', 'Date', 'Time'],
		bool: ['is'],
		number: ['Id', 'Count', 'Sum']
	}	

	typeMatches = {
		'String': 'string',
		'Boolean': 'boolean',
		'ID': 'number',
		'Int': 'number',
		'Date': 'string',
		'DateTime': 'string',
		'JSONString': 'any',
		'Positive': 'number',
		'Foreign': 'number',
	}


	/**
	 * @pparam {{ 
	 * 	rules: { 
	 * 		string: string[]; bool: string[]; number: string[]; 
	 * 	}; 
	 * 	useServerTypes: boolean 
	 * }} options
	 */
	constructor(options){
		
		let keyValidator = Object.keys(this.rules);
		this.rules = options.rules || this.rules;
		this.options = options;
		
		if (options.rules){
			if (!keyValidator.every(k => k in this.rules)){
				throw new Error('All base types are not defined (string, bool, number)');
			}
		}
	}


	/**
	 * добавляет сгенерированные типы в codeTypes и возвращает ее
	 * @param {*} filename - имя файла
	 * @param {*} codeTypes - типы тайпскрипт в виде объекта	
	 * @param {*} graTypes - типы тайпскрипт в виде строк
	 * @returns typescript code
	 */
	 async getTypes(filename, codeTypes, graTypes) {
		
		if (this.serverTypes === null) {
			try{
				await this.getSchemaTypes();		
			}
			catch(ex){
				this.serverTypes = {}
				console.warn(`Attention: graphql server unavalible! Types will be generated via field namings\n`);
			}
		}
		
		let gqlDe = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
		let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);

		console.log(gqls.length);		

		for (const query of gqls) {

			try{
				// @ts-ignore
				var definition = gql(query).definitions.pop();
			}
			catch(ex){
				console.warn('Detected wrong gql syntax. Check comments');
				continue;
			}

			console.log('-');

			const typeName = definition.name?.value || 'undefined';
			typeName === 'undefined' && console.warn(`Warning: detected undefined query name in ${filename}`);

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
			
			let selections = definition.selectionSet.selections;
			
			let serverType = Object.entries(this.serverTypes).find(([k, v]) => k == typeName)
			
			let gpaType = this.getType(selections, undefined, serverType);
			if (this.options.attachTypeName){
				gpaType.lines = `\n    __typename: ${typeName},\n\n` + gpaType.lines
			}

			let typeString = `\n\nexport type ${typeName} = {\n${gpaType.lines}};`;

			codeTypes += typeString;
			graTypes.push(gpaType);
		}
		return codeTypes;
	}


	/**
	 * genarate code from graphql node
	 * @param {[*]} selections - selections array
	 * @param {number} deep count
	 * @param {[string, {string: string}]} root - root type name
	 * 
	 * @returns type object and code
	 */
	getType(selections, deep, root, branchOfFields) {

		let _gpaType = {};	
		let lines = ''	

		deep = (deep || 0) + 4;
		
		for (const selection of selections) {
		
			if (selection.selectionSet){
					
				let _lines = '', _gpaType = {}

				// this.rawSchema.reduce((acc, el) => ((acc[el.name] = el.fields), acc), {})
				let _type = (this.serverTypes || [])[selection.name?.value];

				if (_type && false){

					_lines = this.getServerType(selection, _gpaType, _lines);
				}
				else{
					({_gpaType, lines: _lines} = this.getType(
						selection.selectionSet.selections, 
						deep, 
						root, (deep >= 8) ? [...branchOfFields || [], selection.name.value] : undefined
						// selection.selectionSet.selections, deep + 4
					))
				}

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

				// server type apply:
				if (this.options.useServerTypes && deep >= 8 && root){					
					// if (deep > 8){
					// 	console.log(branchOfFields);			
					// 	// ? [branchOfFields.slice().pop(), root[1][branchOfFields[0]]] 			
					// }
					try{
						let [rootName, types] = branchOfFields 						
							? [branchOfFields.slice().pop(), branchOfFields.reduce((acc, elem) => acc[elem], root[1])]
							: root;
						gType = this.typeMatches[Array.isArray(types) ? types[0][fieldName] : types[fieldName]];
						if (!gType){
							console.warn(`${fieldName} field has not found in type ${rootName}`);
						}
					}
					catch(e){
						console.log(e);
					}
				}				

				if (!gType || gType === any){
					if (this.rules.number.some(m => fieldName.endsWith(m) || m.toLowerCase() === fieldName)){
						gType = 'number'
					}
					if (this.rules.string.some(m => fieldName.startsWith(m.toLowerCase()) || fieldName.endsWith(m))){
						gType = 'string'
					}
					else if(this.rules.bool.some(m => selection.name.value.startsWith(m))){
						gType = 'boolean'
					}
				}

				_gpaType[selection.name.value] = gType || any;

				lines += ' '.repeat(deep) + selection.name.value + `: ${gType || any},\n`
			}
		}

		return {_gpaType, lines};

	}

	getServerType(selection, _gpaType, _lines) {

		let fields = selection.selectionSet.selections.map(f => f.name.value);
		let selectionType = this.serverTypes[selection.name?.value];
		let isArray = Array.isArray(selectionType);
		if (isArray)
			_gpaType[selection.name.value] = [];

		for (const field of fields) {
			if (!isArray) {
				// this.serverTypes[field.slice(0, -1)]
				let fieldType = selectionType[field];
				let tsType = this.patterns[fieldType] || fieldType.toLowerCase();
				_gpaType[field] = tsType;
				_lines += ' '.repeat(8) + `${field}:${tsType},\n`;
			}
			else {
				let fieldType = selectionType[0][field];
				let tsType = this.patterns[fieldType] || fieldType.toLowerCase();
				_gpaType[selection.name.value][field] = tsType;
				_lines += ' '.repeat(8) + `${field}:${tsType},\n`;
			}

		}
		return _lines;
	}

	async getSchemaTypes(typeName){

		let serverTypes = {}		

		let rawSchema = await this.typesRequest(this.queriesInfoQuery);	
		this.rawSchema = rawSchema = rawSchema.data.__schema.types.filter(t => !t.name.startsWith('__'));
		let mutationTypes = rawSchema.find(t => t.name == 'Mutation').fields;

		let argTypes = []
		
		for (const mutation of mutationTypes) {
			if (mutation.description.startsWith(':::')){
				
				let inputFields = mutation.description.substring(3).split('\n')
					.filter(item => item.trim())
					.map(item => item.trim().split(':'));
				let typeDec = `export type ${mutation.name + 'Args'} = {\n    ` + inputFields
					.map(([k, v]) => `${k}: ${this.typeMatches[('' + v).trim()] || (v || 'unknown').trim()}`)
					.join(',\n    ') + '\n}'
				this.mutationArgs += '\n' + typeDec + '\n';
				argTypes.push(mutation.name);
			}
		}

		this.argTypes += argTypes.reduce(
			(accType, typeName) => accType += (`    ${typeName}: ${typeName}Args,\n`), 
			'export type ArgTypes = {\n'
		) + '}'


		let rawTypes = rawSchema.find(t => t.name == 'Query').fields;
		for (let key in rawTypes)
		{
			const rawType = rawTypes[key];			
			let type = rawType.type.name || rawType.type.ofType?.name;	
			type = type || (rawType.name.endsWith('s') 				
				? rawTypes.find(t => t.name == rawType.name.slice(0, -1))?.type.name
				: 'unknown[]'
			);			

			if (type){
				let tsType = {}
				for (const field of rawSchema.find(t => type == t.name).fields) 
				{
					tsType[field.name] = field.type.name || field.type.ofType.name;
					if (!~['Int', 'String', 'Boolean', 'ID', 'DateTime', 'Date'].indexOf(tsType[field.name])){
						const subType = rawSchema.find(w => w.name == tsType[field.name]);
						if (subType && subType.fields && subType.fields.length) {
							tsType[field.name] = {}
							for (const subField of subType.fields) {
								tsType[field.name][subField.name] = subField.type.name || subField.type.ofType.name;
							}
						}

					}
					tsType[field.name] = tsType[field.name] || 'object[]';
					// tsType[type] = field.type.name || field.type.ofType.name;
				}
				// serverTypes[rawType.name] = rawType.type.name 
				serverTypes[type] = rawType.type.name 
					? tsType
					: [tsType]
			}
		}

		// rawSchema.filter(t => ~Object.values(serverTypes).indexOf(t.name))
		
		this.verbose && console.log(rawSchema);

		this.serverTypes = serverTypes;
	}


	/**
	 * @param {string} queriesInfoQuery
	 */
	typesRequest(queriesInfoQuery){
		
		return new Promise(function(resolve, reject) {
			// Эта функция будет вызвана автоматически
		 
			let data = ''
			const options = {		
				hostname: '127.0.0.1',
				port: 8000,
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

	queriesInfoQuery = `
		query Queries{
			__schema {
				types {
					name,
					fields {
						name,        
						description
						type {
							name,          
							ofType {
								name					  
							}
						}
					}
				}
			}
		}	
	`

}

module.exports = {
	TypesGenerator
}