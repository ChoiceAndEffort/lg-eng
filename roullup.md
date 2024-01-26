<!--
 * @Author: lg
 * @Date: 2024-01-25 15:52:32
 * @LastEditors: lg
 * @LastEditTime: 2024-01-26 10:27:58
 * @Description: 
 * @FilePath: \lg-eng\roullup.md
-->
# Rollup.js

## sourcemap

Rollup.js 的 sourcemap（源代码映射）是一种用于调试和错误追踪的技术，它能够将打包后的代码映射回
原始的源代码。


## 插件的作用

- rollup 打包
- rollup-plugin-terser 压缩
- rollup-plugin-typescript2 处理ts
- typescript 
- rollup-plugin-delete 清除dist上次打包的文件

- @rollup/plugin-node-resolve
>在打包过程中，Rollup.js 会尝试将所有模块打包到一个文件中，但是如果你的代码依赖于其他模块，则这些模块需要以某种方式引入。通常情况下，这些模块来自于 npm 包或者浏览器全局变量（例如 jQuery），而不是你自己编写的模块。

为了处理这些依赖项，你可以使用 @rollup/plugin-node-resolve 插件来告诉 Rollup.js 从哪里查找这些模块。该插件会基于模块的名称解析出实际的文件路径，并把它们作为本地模块处理。这样，就可以确保你的代码中的 import 语句可以正确地找到外部依赖。

- @rollup/plugin-commonjs
>主要用于将 CommonJS 格式的模块转换为 Rollup 可以理解的形式，以便能将其打包进最终的 bundle 中。在 Node.js 生态系统中，许多第三方库使用 CommonJS（通过 require 和 module.exports）的方式来导出和导入模块。然而，Rollup 默认处理的是 ES 模块（通过 import 和 export）。因此，当你在 Rollup 中引用 CommonJS 模块时，如果不使用 @rollup/plugin-commonjs，Rollup 将无法正确解析和打包这些模块。