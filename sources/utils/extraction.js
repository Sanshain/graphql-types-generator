//@ts-check

const { scalarTypes, rules } = require('./rules');


const anyType = 'any';  
const unknownTypes = {}

exports.unknownTypes = unknownTypes;

/**
 * genarate code from graphql node
 * @this {import('../utils').TypesBuilder} 
 * @param {readonly [import("graphql").OperationDefinitionNode]} selections
 * @param {number} deep count
 * @param {string[] | null | undefined} branchOfFields	 
 * @param {[string, object] | undefined} [parentTypeInfo] - root type name - !! TODO delete (unusal)
 * @returns {{
 * 	_gpaType: Record<string, string>, 
 * 	lines: string, 
 * 	isNestedList: boolean
 * }} type object and code
 */
exports.extractType = function extractType(selections, deep, branchOfFields, parentTypeInfo) {

	/**
	 * @type {Record<string, string>}
	 */
	let _graphType = {};
	let lines = ''
	
	deep = (deep || 0) + 4;

	let subType = null;
	let subTypeFields = null
	const subFieldName = branchOfFields?.slice(-1).pop();
	const subFieldInfo = this.serverSubTypes.find(tp => tp.name == subFieldName);
	if (subFieldInfo) {
		subType = subFieldInfo.type;
		// TODO fix: => type.kind == 'LIST'
		if (!subType && subFieldName?.slice(-1) === 's') {
			// subType = this.serverSubTypes.find(tp => tp.name == subFieldName.slice(0, -1))?.type;

			subType = this.serverSubTypes.find(tp => tp.name == subFieldName)?.type

			// || this.serverSubTypes.find(
			// 	tp => tp.name == subFieldName.slice(0, -1)
			// )?.type;				

			if (subType === 'undefined') {
				console.log(`--> Unexpected sub type ${subFieldName}: defining types by naming rules`);
			}
			else {
				console.log(`--> Unexpected sub type ${subFieldName}: defining types by naming rules *`);
				// type == 'null'	
				// console.log(`--> sub type ${subTypeName} is not found. Using ${subTypeName.slice(0, -1)} instead`);
			}
		}
		if (subType) {
			//@ts-ignore
			subTypeFields = this.serverTypes[subFieldName]; // this.serverTypes[subType];
			if (!subTypeFields) {
				console.warn(`--> Unexpected type ${subType} from sub types: defining types by name rules **`);
			}
		}
	}

	let isLIST = Array.isArray(subTypeFields);
	subTypeFields = isLIST ? subTypeFields[0] : subTypeFields;
	if (subFieldName && !subTypeFields) {
		if (this.mutationTypes?.[subFieldName]) {
			isLIST = this.mutationTypes[subFieldName].type.kind === 'LIST'
		}
		else if (branchOfFields && this.mutationTypes?.[branchOfFields[0]]) {

			let subFuelds = this.mutationTypes?.[branchOfFields[0]].type.fields
			isLIST = subFuelds.find(f => f.name == subFieldName).type.kind === 'LIST';
		}
		else {
			// naming rule
			isLIST = subFieldName.slice(-1)[0] === 's';
			subTypeFields = {}
		}
	}


	for (const selection of selections) {

		// 

		if (selection.selectionSet && selection.name?.value) {

			nestedTypeGenerate.call(this, selection, extractType);
		}
		else if(selection.name?.value) {

			const fieldName = selection.name?.value;

			if (!fieldName) continue;

			let graphQType = anyType;

			// server type apply:
			if (this.options.useServerTypes && deep >= 8 && parentTypeInfo) {
				// if (deep > 8){
				// 	console.log(branchOfFields);			
				// 	// ? [branchOfFields.slice().pop(), root[1][branchOfFields[0]]] 			
				// }

				let [rootName, types = {}] = (branchOfFields && branchOfFields.length > 1)
					? [
						branchOfFields.slice().pop(),
						parentTypeInfo[1]
					]
					: parentTypeInfo;
				graphQType = scalarTypes[Array.isArray(types) ? types[0][fieldName] : types[fieldName]];
				if (!graphQType) {
					this.options.verbose && console.warn(
						`"${fieldName}" field has not found by parsing root type ${rootName}`
					);
				}
			}

			// subTypeFields && subType - `means if Query`
			if (subTypeFields && (!graphQType || graphQType === anyType) && subType) {

				let subField = subTypeFields[fieldName];
				if (subField) {
					graphQType = scalarTypes[subField];
				}
				else {
					this.options.verbose && console.warn(
						`=> Unexpacted field "${fieldName}" in ${subType}. Definging from naming`
					);
				}
			}
			
			if (this.mutationTypes?.[subFieldName]?.type?.fields) {
				const filter = (/** @type {{ name: string; }} */ w) => w.name == fieldName;
				const GraphType = this.mutationTypes?.[subFieldName]?.type?.fields?.find(filter)?.type?.name
				graphQType = scalarTypes[GraphType]
				if (!graphQType) {
					console.log(`- unknown no browser type '${GraphType}' in \`${subFieldName}.${fieldName}\``);
					// TODO dynamically create brand type:
					if (GraphType) {
						graphQType = unknownTypeApply(this.options, GraphType);
					}					
				}
				
			}

			if (this.options.useServerTypes && this.options.verbose && graphQType === anyType){
				`!> type for ${subFieldName}.${fieldName} didn't recognised`
			}

			graphQType = graphQType || generateTypeFromRules(fieldName);

			_graphType[selection.name.value] = graphQType || anyType;

			lines += ' '.repeat(deep) + selection.name.value + `: ${graphQType || anyType},\n`
		}
		else{
			if (this.options.debug) throw new Error('Unexpected: selection w/o value name')
			else {
				console.warn('Unexpected: selection w/o value name. Enable debug mode for more info (w traceback)');
			}
		}
	}

	return { _gpaType: _graphType, lines, isNestedList: isLIST };


	/**
	 * @this {import("../utils.js").TypesGenerator}
	 * @param {*} selection 
	 */
	function nestedTypeGenerate(selection) {
		let _lines = '',
			/** @type object */
			compositeType = {}, isNestedList = false;

		// this.rawSchema.reduce((acc, el) => ((acc[el.name] = el.fields), acc), {})
		let _type = (this.serverTypes || [])[selection.name?.value];
		if (!_type && this.mutationTypes) {
			// _type = this.mutationTypes[selection.name?.value].type.fields
			// debugger
		}

		if (subType && subTypeFields) {

			/**
			 * @param {{ [s: string]: any; } | ArrayLike<any>} typeFields
			 * @param {number} _deep
			 */
			function genLines(typeFields, _deep) {

				let __gpaType = {};
				let self = this;

				let __lines = Object.entries(typeFields).reduce(function (/** @type {string} */ acc, [k, v], /** @type {any} */ i, /** @type {any} */ arr, /** @type {any} */ _) {
					if (typeof v !== 'object') {
						__gpaType[k] = scalarTypes[v];
						acc += `${' '.repeat(_deep)}${k}: ${scalarTypes[v]},\n`;
					}
					else if (v) {
						let [sub_gpaType, sub_Lines] = genLines(typeFields[k], _deep + 4);
						__gpaType[k] = sub_gpaType;
						acc += sub_Lines;
					}
					return acc;
				}, '');

				return [__gpaType, __lines];
			}

			let _subTypeFields = subTypeFields[selection.name?.value + ''];
			if (_subTypeFields && typeof _subTypeFields === 'object') {
				let __grapType;
				([__grapType, _lines] = genLines.call(this, subTypeFields[selection.name?.value + ''], deep + 4));
				compositeType[selection.name?.value + ''] = __grapType;
			}

		}

		if (_type) {


			_lines = this.getServerType(selection, compositeType, _lines, deep + 4);

			// здесь можно заполнить серверные строки
		}
		else if (!_lines) {
			if (this.options.useServerTypes) {
				console.warn(!this.options.debug ? '\x1b[33m': '\x1b[31m',
					`> Server type associated with name \`${selection.name?.value}\` doesn't found`,
				'\x1b[0m');
			}
			({ _gpaType: compositeType[selection.name?.value + ''], lines: _lines, isNestedList } = extractType.call(this,
				selection.selectionSet.selections,
				deep,
				[...branchOfFields || [], selection.name?.value]
				// selection.selectionSet.selections, deep + 4
			));
		}

		// _gpaType[selection.name.value] = _gpaType;	
		// const offset = ' '.repeat(deep + 4);			
		isNestedList = Array.isArray(compositeType[selection.name?.value]);
		let value = `{\n${_lines}${' '.repeat(deep)}}` + (isNestedList ? '[]' : '');
		let values = null;

		// //@ts-expect-error
		// const isLIST = selection.kind === 'LIST' || (!selection.kind && selection.name.value.slice(-1) === 's')
		// if (isLIST)		{
		// 	if (deep % 8 === 0) values = `${value}[]`;
		// 	else{
		// 		values = `Array<${value}>`;
		// 	}
		// }
		// let values = `[\n${offset}{\n${_lines}${offset}}\n${' '.repeat(deep)}]`;
		_graphType[selection.name?.value] = compositeType[selection.name?.value] || anyType;
		const optional = this.options.makeNodesAsOptional ? '?' : '';
		lines += ' '.repeat(deep) + selection.name?.value + optional + `: ${values || value},\n`;
	}

}

/**
 * @param {import('./../main.d').BaseOptions} options
 * @param {string} GraphType
 */
function unknownTypeApply(options, GraphType) {
	let graphQType = 'never';
	if (options.unknownTypesAsIs) graphQType = GraphType; 
	else if (options.screentypes === true) {
		if (!unknownTypes[GraphType]) unknownTypes[GraphType] = `type ${GraphType} = ScreenType<Object>`;
		graphQType = GraphType;
	}
	else {
		graphQType = 'unknown';
	}
	return graphQType;
}

/**
 * @param {string} fieldName
 */
function generateTypeFromRules(fieldName) {	
	let graphQType = anyType
	if (rules.number.some(m => fieldName.endsWith(m) || m.toLowerCase() === fieldName)) {
		graphQType = 'number';
	}
	if (rules.string.some(m => fieldName.startsWith(m.toLowerCase()) || fieldName.endsWith(m))) {
		graphQType = 'string';
	}
	else if (rules.bool.some(m => fieldName.startsWith(m))) {
		graphQType = 'boolean';
	}
	return graphQType;
}

exports.generateTypeFromRules = generateTypeFromRules;
exports.unknownTypeApply = unknownTypeApply;