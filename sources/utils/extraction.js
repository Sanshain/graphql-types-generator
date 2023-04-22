//@ts-check

const { scalarTypes } = require('./rules');


const any = 'any';  

/**
 * genarate code from graphql node
 * @this {import('../utils').TypesBuilder} 
 * @param {readonly [import("graphql").OperationDefinitionNode]} selections
 * @param {number} deep count
 * @param {string[] | undefined} rootTree - root type name - !! TODO delete (unusal)
 * @param {any[] | null | undefined} branchOfFields	 
 * @returns {{
 * 	_gpaType: Record<string, string>, 
 * 	lines: string, 
 * 	isNestedList: boolean
 * }} type object and code
 */
exports.extractType = function extractType(selections, deep, rootTree, branchOfFields) {

	/**
	 * @type {Record<string, string>}
	 */
	let _gpaType = {};
	let lines = ''
	
	deep = (deep || 0) + 4;

	let subType = null;
	let subTypeFields = null
	const subFieldName = branchOfFields?.slice(-1).pop();
	const subFieldInfo = this.serverSubTypes.find(tp => tp.name == subFieldName);
	if (subFieldInfo) {
		subType = subFieldInfo.type;
		// TODO fix: => type.kind == 'LIST'
		if (!subType && subFieldName.slice(-1) === 's') {
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

		if (selection.selectionSet) {

			let _lines = '', _compositeSType = {}, isNestedList = false

			// this.rawSchema.reduce((acc, el) => ((acc[el.name] = el.fields), acc), {})
			//@ts-expect-error
			let _type = (this.serverTypes || [])[selection.name?.value];

			if (subType && subTypeFields) {

				/**
				 * @param {{ [s: string]: any; } | ArrayLike<any>} typeFields
				 * @param {number} _deep
				 */
				function genLines(typeFields, _deep) {

					let __gpaType = {}
					let self = this;					

					let __lines = Object.entries(typeFields).reduce(function (/** @type {string} */ acc, [k, v], /** @type {any} */ i, /** @type {any} */ arr, /** @type {any} */ _) {
						if (typeof v !== 'object') {
							__gpaType[k] = scalarTypes[v]
							acc += `${' '.repeat(_deep)}${k}: ${scalarTypes[v]},\n`
						}
						else if (v) {
							let [sub_gpaType, sub_Lines] = genLines(typeFields[k], _deep + 4)
							__gpaType[k] = sub_gpaType
							acc += sub_Lines
						}
						return acc;
					}, '')

					return [__gpaType, __lines]
				}

				let _subTypeFields = subTypeFields[selection.name?.value + ''];
				if (_subTypeFields && typeof _subTypeFields === 'object') {
					let __gpaType;
					([__gpaType, _lines] = genLines.call(this, subTypeFields[selection.name?.value + ''], deep + 4))
					_compositeSType[selection.name?.value] = __gpaType;
				}

			}

			if (_type && false) {

				//@ts-ignore
				_lines = this.getServerType(selection, _compositeSType, _lines);

				// здесь можно заполнить серверные строки
			}
			else if (!_lines) {
				({ _gpaType: _compositeSType[selection.name?.value], lines: _lines, isNestedList } = extractType.call(this,
					selection.selectionSet.selections,
					deep,
					[subFieldName].concat(rootTree || []),
					(deep >= 4) ? [...branchOfFields || [], selection.name?.value] : undefined
					// selection.selectionSet.selections, deep + 4
				))
			}

			// _gpaType[selection.name.value] = _gpaType;	
			// const offset = ' '.repeat(deep + 4);			

			let value = `{\n${_lines}${' '.repeat(deep)}}` + (isNestedList ? ' []' : '');
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

			_gpaType[selection.name?.value + ''] = _compositeSType[selection.name?.value] || any;
			const optional = this.options.makeNodesAsOptional ? '?' : '';
			lines += ' '.repeat(deep) + selection.name?.value + optional + `: ${values || value},\n`
		}
		else {

			const fieldName = selection.name?.value;

			if (!fieldName) continue;

			let graphQType = any;

			// server type apply:
			if (this.options.useServerTypes && deep >= 8 && rootTree) {
				// if (deep > 8){
				// 	console.log(branchOfFields);			
				// 	// ? [branchOfFields.slice().pop(), root[1][branchOfFields[0]]] 			
				// }
				try {
					let [rootName, types = {}] = (branchOfFields && branchOfFields.length > 1)
						? [
							branchOfFields.slice().pop(),
							branchOfFields.slice((deep - 8) / 4).reduce(
								(/** @type {{ [x: string]: any; }} */ acc, /** @type {string | number} */ elem) => {
									return acc[elem], rootTree[1]
								}
							)
						]
						: rootTree;
					graphQType = scalarTypes[Array.isArray(types) ? types[0][fieldName] : types[fieldName]];
					if (!graphQType) {
						this.options.verbose && console.warn(
							`"${fieldName}" field has not found by parsing root type ${rootName}`
						);
					}
				}
				catch (e) {
					console.log(e);
				}
			}

			// subTypeFields && subType - `means if Query`
			if (subTypeFields && (!graphQType || graphQType === any) && subType) {

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
					console.log(graphQType);
				}
				if ('userSettingsMutation' == subFieldName) {
					this.options.verbose && console.log('userSettingsMutation');
				}
			}

			if (!graphQType || graphQType === any) {
				if (this.rules.number.some(m => fieldName.endsWith(m) || m.toLowerCase() === fieldName)) {
					graphQType = 'number'
				}
				if (this.rules.string.some(m => fieldName.startsWith(m.toLowerCase()) || fieldName.endsWith(m))) {
					graphQType = 'string'
				}
				else if (this.rules.bool.some(m => selection.name?.value.startsWith(m))) {
					graphQType = 'boolean'
				}
			}

			_gpaType[selection.name.value] = graphQType || any;

			lines += ' '.repeat(deep) + selection.name.value + `: ${graphQType || any},\n`
		}
	}

	return { _gpaType, lines, isNestedList: isLIST };

}