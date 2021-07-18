import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './start.js',
//   input: './sources/main.js',
  output: {	  
	  name: 'typesGenerate',
     file: 'main.js',
   //   format: 'iife',
     format: 'es',
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
    })
  ]
};