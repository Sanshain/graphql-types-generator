//@ts-check
// cli

const typesGenerate = require('./sources/main');


var args = process.argv.slice(2);

/**
 * @param {`${string}`} argname
 */
function getParam(argname) {

	let hasTarget = args.indexOf(argname);
	if (~hasTarget && args.length > hasTarget + 1){
	
		let filename = args[hasTarget + 1];
		return filename;
	}	

	return null;
}

const options = {}, 
params = {
	'-s': 'filename',
	'-t': 'target',	
	'-p': 'useServerTypes.port',
	'-h': 'useServerTypes.host',
	'--ds': 'declarateSource',
	'--m': 'matchTypeNames',
	'--st': 'screentypes'
}

/*
	'-d': 'declarateSource',
	'-m': 'matchTypeNames'
*/


for (const key in params) {
	
	/// for truthy options:
	if (key.startsWith('--') && ~args.indexOf(key)){
		const param = params[key]
		
		/// for bool option:
		if (key.length < 4) options[param] = true 
		else {
			/// for doublicate string value from another option:
			const anotherOption = '-' + key.slice(3)
			let value = getParam(anotherOption);

			options[param] = [value];
		}
		continue
	}

	/// for complex options: 
	let option = getParam(key);
	if (option) {

		/// for key-value options:
		let param = params[key]		
		if (!~param.indexOf('.')) options[param] = option;		
		else{

			/// for complex options like `useServerTypes.host`:
			const [rootOption, nestedOption] = param.split('.');
			options[rootOption] = options[rootOption] || {}
			options[rootOption][nestedOption] = option
		}
	}
}

if (!('filename' in options)) {
	if (process.argv.length < 3) throw new Error('Point your source file with queries')
	else{
		options.filename = process.argv[2];
	}
}

console.log(process.argv);


(async function main() {
	// options.useServerTypes = options.useServerTypes || true;
	// @ts-ignore
	typesGenerate(options);	
})();
