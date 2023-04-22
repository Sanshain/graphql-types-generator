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
	'String': 'string',
	'Boolean': 'boolean',
	'ID': 'number',
	'Int': 'number',
	'Integer': 'number',
	'Date': 'string',
	'DateTime': 'string',
	'JSONString': 'any',
	'Positive': 'number',
	'Foreign': 'number',
};	

Object.keys(browserTypes).forEach(k => browserTypes[k + '!'] = browserTypes[k])

exports.scalarTypes = browserTypes;