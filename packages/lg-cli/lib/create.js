/*
 * @Author: lg
 * @Date: 2024-01-15 18:16:01
 * @LastEditors: lg
 * @LastEditTime: 2024-01-15 18:22:49
 * @Description:
 * @FilePath: \lg-cli\lib\create.js
 */
const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const Generator = require('./generator')

// 1. 对外暴露出一个方法用来接收用户要创建的文件项目名以及参数
module.exports = async function (name, options) {
  // 判断项目是否存在
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  // 目录是否存在
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建
    if (options.force) {
      await fs.remove(targetAir);
    } else {
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

      // 如果用户拒绝覆盖则停止生于操作
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        await fs.remove(targetAir);
      }
    }
  }

  // 新建模板
  const generator = new Generator(name, targetAir);
  generator.create();
};
