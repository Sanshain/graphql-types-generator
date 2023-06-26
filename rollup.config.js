//@ts-check

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import path from "path";

export default {
	input: './cli-runner.js',
//   input: './example.js',
//   input: './sources/main.js',
   output: {	  
	  name: 'typesGenerate',
     file: './bin/cli-runner',
   //   format: 'iife',
   //   format: 'es',
     format: 'cjs',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({
      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: { 'react': ['createElement', 'Component' ] },  // Default: undefined
    }),

	 {
		name: 'rollup-plugin-shebang-insert',
		/**
		 * @param {{file: string}} opts - options
		 * @param {{[fileName: string]: {code: string}}} bundle 
		 */
		generateBundle(opts, bundle) {                        

			 const file = path.parse(opts.file).base
			 let code = bundle[file].code;
			 bundle[file].code = '#!/usr/bin/env node\n\n' + bundle[file].code
		}
  }	 
  ]
};