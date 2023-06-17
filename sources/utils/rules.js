//@ts-check

/// for server approach 
exports.browserTypes = {
	ID: 'number',
	DateTime: 'Date | string',
	JSONString: 'File[] | object',
	null: 'any',
}

/**
 * @description for naming approach 
 * @type {Exclude<Required<import('../main').BaseOptions['rules']>, undefined>}
 */	
 exports.rules = {
	/// endsWith:
	string: ['Name', 'Title', 'Date', 'Time'],
	number: ['Id', 'Count', 'Sum'],
	/// startsWith:
	bool: ['is'],
}	

let browserTypes = {	
	'ID': 'number',	
	// 'JSONString': 'object',						// any? 
	'JSONString': 'JSONString',					// any? 
	'Positive': 'number',
	
	'Foreign': 'number',
	'String': 'string',
	'Boolean': 'boolean',	
	'Int': 'number',
	'Integer': 'number',
	'Date': 'string',								  // '0001-01-01'
	'DateTime': 'string',
};	

const baseGraphTypeKeys = Object.keys(browserTypes)

baseGraphTypeKeys.forEach(k => browserTypes[k + '!'] = browserTypes[k])

exports.forceRequireTypes = baseGraphTypeKeys.slice(0, 3).concat('any')

/**
 * @_type {typeof browserTypes & {[K in keyof typeof browserTypes as `${K}!`] : typeof browserTypes[K] }}
 */
//@ts-ignore
let scalarTypes = browserTypes;

exports.scalarTypes = scalarTypes;

