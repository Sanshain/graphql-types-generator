//@ts-check

// import { typesGenerate } from "./sources/main";
const typesGenerate = require('./sources/main');
// import { typesGenerate } from "./main";

async function main() {
	await typesGenerate({
		// filename: './examples/mutations.js',
		// filename: './examples/queries.js',
		filename: '',
		files: [
			'./examples/real/queries.js',
			'./examples/real/autoqueries.js',
			'./examples/real/mutations/auth.ts',
		],
		target: './queries.d.ts',
	});	
}

main();