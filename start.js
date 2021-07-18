//@ts-check

// import { typesGenerate } from "./sources/main";
const { typesGenerate } = require('./sources/main');
// import { typesGenerate } from "./main";

async function main() {
	await typesGenerate();	
}

main();