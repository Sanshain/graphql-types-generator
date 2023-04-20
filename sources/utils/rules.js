/// for server approach 
export const browserTypes = {
	ID: 'number',
	DateTime: 'Date | string',
	JSONString: 'File[] | object',
	null: 'any',
}

/**
 * @description for naming approach 
 * @type {Exclude<Required<import('./main').BaseOptions['rules']>, undefined>}
 */	
 export const rules = {
	/// endsWith:
	string: ['Name', 'Title', 'Date', 'Time'],
	number: ['Id', 'Count', 'Sum'],
	/// startsWith:
	bool: ['is'],
}	

export const scalarTypes = {
	'String': 'string',
	'Boolean': 'boolean',
	'ID': 'number',
	'Int': 'number',
	'Date': 'string',
	'DateTime': 'string',
	'JSONString': 'any',
	'Positive': 'number',
	'Foreign': 'number',
};	
