<!--
 * @Author: lg
 * @Date: 2024-01-15 18:00:30
 * @LastEditors: lg
 * @LastEditTime: 2024-01-16 11:08:36
 * @Description:
 * @FilePath: \lg-eng\lg-cli\readme.md
-->

## 实现思路

- 安装相关依赖

```js
    npm i commander //加入命令交互
    npm i inquirer@8.2.4   //询问用户
    npm i chalk@4.1.0  //美化
    npm i ora@5.4.1   //加载状态
    npm i download-git-repo //下载模板
```

- 确定 bin 入口

```sh
#! /usr/bin/env node
```

- 确定创建指令和提示

```js
const program = require('commander');

program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    console.log('program name is', name);
  });

// 解析用户执行命令的传入参数
program.parse(process.argv);
```

- 问询用户

```js
const inquirer = require('inquirer');
const { action } = inquirer.prompt([
  {
    name: 'action',
    type: 'list',
    message: 'Target directory already exists',
    choices: [
      {
        name: 'Overwrite',
        value: 'overwrite'
      },
      {
        name: 'Cancel',
        value: false
      }
    ]
  }
]);
```

- 问询用户

```js
const inquirer = require('inquirer');
const { action } = inquirer.prompt([
  {
    name: 'action',
    type: 'list',
    message: 'Target directory already exists',
    choices: [
      {
        name: 'Overwrite',
        value: 'overwrite'
      },
      {
        name: 'Cancel',
        value: false
      }
    ]
  }
]);
```

- 封装 loading 加载动态外壳

```js
const wrapLoading = async (fn, message, ...args) => {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail('Request failed, please refetch...');
    console.log(error, '------');
  }
};
```

- 控制台颜色标识
  > \r\n 是换行符

```js
console.log(
  `\r\n 
  Successfully created project ${chalk.cyan(this.name)} 
  \r\n cd ${chalk.cyan(this.name)} 
  
  \r\n npm install`
);
```

- 下载模板

```js
const util = require('util');
const downloadGitRepo = require('download-git-repo');
this.downloadGitRepo = util.promisify(downloadGitRepo);

const projectName = 'my-project'; // 项目名称
const branchName = 'main'; // 分支名称

const repoUrl = `username/repo#${branchName}`;

this.downloadGitRepo(repoUrl, projectName, { clone: true });
```
