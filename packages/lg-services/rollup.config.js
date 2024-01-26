/*
 * @Author: lg
 * @Date: 2024-01-25 14:44:13
 * @LastEditors: lg
 * @LastEditTime: 2024-01-26 18:52:26
 * @Description:
 * @FilePath: \lg-eng\packages\lg-services\rollup.config.js
 */
import typescript from 'rollup-plugin-typescript2';

// import { terser } from 'rollup-plugin-terser';

import deletePlugin from 'rollup-plugin-delete';

// import resolve from '@rollup/plugin-node-resolve';

// import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      globals: {
        axios: 'axios'
      }
      // sourcemap: true,
    },
    // {
    //   file: 'dist/index.cjs.js',
    //   format: 'cjs',
    //   exports: 'auto',
    //   globals: {
    //     axios: 'axios'
    //   }
    //   // sourcemap: true
    // },
    // {
    //   file: 'dist/index.umd.js',
    //   name: 'MyLib',
    //   format: 'umd',
    //   globals: {
    //     axios: 'axios'
    //   }
    //   // sourcemap: true
    // }
  ],
  external: ['axios'],
  plugins: [
    // resolve(),
    // commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    // terser(),

    deletePlugin({
      targets: 'dist/*'
    })
  ]
};
