//@ts-check

const gql = require('graphql-tag');
const fs = require('fs');
const http = require('http');


const any = 'any';


class TypesGenerator{

	serverTypes = null

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
		number: ['Id']
	}	

	constructor(options){
		
		let keyValidator = Object.keys(this.rules);
		this.rules = options.rules || this.rules;
		
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
				console.warn(`Warning: graphql server unavalible. Attention! Types will generates via fields naming\n`);
			}
		}

		let gqlDe = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
		let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);

		for (const query of gqls) {

			// @ts-ignore
			let definition = gql(query).definitions.pop();

			const typeName = definition.name?.value || 'undefined';
			typeName === 'undefined' && console.warn(`typename is undefined in ${filename}`);
			
			let selections = definition.selectionSet.selections;
			
			let gpaType = this.getType(selections, undefined);

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
	 * @returns type object and code
	 */
	getType(selections, deep) {

		let _gpaType = {};	
		let lines = ''

		deep = (deep || 0) + 4;
		
		for (const selection of selections) {
		
			if (selection.selectionSet){
					
				let _lines = '', _gpaType = {}

				let _type = (this.serverTypes || [])[selection.name?.value];
							
				if (_type && false){

					_lines = this.getServerType(selection, _gpaType, _lines);
				}
				else{
					({_gpaType, lines: _lines} = this.getType(
						selection.selectionSet.selections, deep
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

				if (this.rules.number.some(m => fieldName.endsWith(m) || m.toLowerCase() === fieldName)){
					gType = 'number'
				}
				if (this.rules.string.some(m => fieldName.startsWith(m.toLowerCase()) || fieldName.endsWith(m))){
					gType = 'string'
				}
				else if(this.rules.bool.some(m => selection.name.value.startsWith(m))){
					gType = 'boolean'
				}

				_gpaType[selection.name.value] = gType;

				lines += ' '.repeat(deep) + selection.name.value + `: ${gType},\n`
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
		rawSchema = rawSchema.data.__schema.types.filter(t => !t.name.startsWith('__'));
		let rawTypes = rawSchema.find(t => t.name == 'Query').fields;
		for (let key in rawTypes)
		{
			const rawType = rawTypes[key];			
			let type = rawType.type.name || rawType.type.ofType?.name;	
			type = type || (rawType.name.endsWith('s') 				
				? rawTypes.find(t => t.name == rawType.name.slice(0, -1))?.type.name
				: null
			);

			if (type){
				let tsType = {}
				for (const field of rawSchema.find(t => type == t.name).fields) 
				{
					tsType[field.name] = field.type.name || field.type.ofType.name;
				}
				serverTypes[rawType.name] = rawType.type.name 
					? tsType
					: [tsType]
			}
		}

		// rawSchema.filter(t => ~Object.values(serverTypes).indexOf(t.name))
		
		console.log(rawSchema);

		this.serverTypes = serverTypes;
	}


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