/*
 * @Author: lg
 * @Date: 2024-01-25 14:44:13
 * @LastEditors: lg
 * @LastEditTime: 2024-01-26 11:56:28
 * @Description:
 * @FilePath: \lg-eng\packages\lg-utils\rollup.config.js
 */
import typescript from 'rollup-plugin-typescript2';

import { terser } from 'rollup-plugin-terser';

import deletePlugin from 'rollup-plugin-delete';

export default {
  input: 'src/main.ts', // 入口文件路径
  output: [
    {
      file: 'dist/index.esm.js', // package.json 中 "module": "dist/index.esm.js"
      format: 'esm' // es module 形式的包， 用来import 导入， 可以tree shaking
      // sourcemap: true,用于压缩后的代码映射到初始为止,便于错误快速定位
    },
    {
      file: 'dist/index.cjs.js', // package.json 中 "main": "dist/index.cjs.js",
      format: 'cjs' // commonjs 形式的包， require 导入
      // sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      name: 'MyLib', // UMD模块的全局变量名
      format: 'umd' // umd 兼容形式的包,可以直接应用于网页 script,UMD模块格式，可用于浏览器全局环境和CommonJS环境
      // sourcemap: true
    }
  ],
  plugins: [
    typescript(), // 使用 rollup-plugin-typescript2 插件处理 TypeScript 代码
    terser(),
    deletePlugin({
      targets: 'dist/*'
    })
  ]
};
