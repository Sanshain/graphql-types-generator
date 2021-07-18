import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './example.js',
//   input: './sources/main.js',
  output: {	  
	  name: 'typesGenerate',
     file: 'this.js',
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
    })
  ]
};