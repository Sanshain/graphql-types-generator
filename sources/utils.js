//@ts-check

// import * as fs from 'fs';
const fs = require('fs');


const any = 'any';


export class TypesGenerator{

	rules = {
		string: ['Name', 'Title', 'Date', 'Time'],
		bool: ['is'],
		number: ['Id']
	}	

	constructor(options){
		
		let keyValidator = Object.keys(this.rules);
		this.rules = options.rules || this.rules;
		
		if (options.rules){
			if (!keyValidator.every(k => k in Object.keys(this.rules))){
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
	 getTypes(filename, codeTypes, graTypes) {

		let gqlDe = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
		let gqls = Array.from(gqlDe.matchAll(/gql`([^`]*?)`/g), m => m[1]);

		for (const query of gqls) {

			// @ts-ignore
			let definition = gql(query).definitions.pop();

			const typeName = definition.name?.value || 'undefined';
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
					
				let {_gpaType, lines: _lines} = this.getType(
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

}
