#! /usr/bin/env node

const program = require('commander');

program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    console.log('program name is', name);
    require('../lib/create')(name, options);
  });

// 解析用户执行命令的传入参数
program.parse(process.argv);
