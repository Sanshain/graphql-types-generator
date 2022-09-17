//@ts-check
// cli

const typesGenerate = require('./sources/main');


var args = process.argv.slice(2);

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
}



for (const key in params) {
	let option = getParam(key);
	if (option) options[params[key]] = option;
}

if (!('filename' in options)) {
	if (process.argv.length < 3) throw new Error('Point your source file with queries')
	else{
		options.filename = process.argv[2];
	}
}

console.log(process.argv);

(async function main() {
	// @ts-ignore
	typesGenerate(options);	
})();
