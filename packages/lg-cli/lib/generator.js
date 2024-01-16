/*
 * @Author: lg
 * @Date: 2024-01-15 18:23:22
 * @LastEditors: lg
 * @LastEditTime: 2024-01-16 10:49:01
 * @Description:
 * @FilePath: \lg-cli\lib\generator.js
 */

const { getRepoList, getBranchList } = require('./http');

const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');

// 封装loading外壳
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

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模版
  // 1. 从远端拉模版数据
  // 2. 用户去选择自己已有下载的模版名称
  // 3. 返回用户选择的模版

  async getRepo() {
    const START_MESSAGE = 'waiting for fetch template';
    const repoList = await wrapLoading(getRepoList, START_MESSAGE);
    if (!repoList) return;
    // console.log(repoList);
    const repos = repoList.map((item) => item.name);
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    });

    return repo;
  }

  // 获取用户选择的分支
  // 1. 基于repo的结果，远程拉分支列表
  // 2. 问询用户选择分支
  async getBranch(repo) {
    try {
      const TAG_MESSAGE = 'waiting for fetch branch';
      const branchRes = await wrapLoading(getBranchList, TAG_MESSAGE, repo);
      if (!branchRes) return;

      const branchList = branchRes.map((item) => item.name);
      const { branch } = await inquirer.prompt({
        name: 'branch',
        type: 'list',
        choices: branchList,
        message: 'Please choose a   branch to create project'
      });
      // console.log('branch----', branch);

      return branch;
    } catch (error) {
      console.log('branch------error', error);
    }

    // return tagsList[0];
  }

  // 下载远程模版
  // 1. 拼接下载地址
  // 2. 调用下载方法
  async download(repo, branch) {
    const requestUrl = `leigong421/${repo}#${branch}`;
    const DOWNLOAD_MESSAGE = 'waiting download template';

    // this.downloadGitRepo(requestUrl, this.name, { clone: true });

    await wrapLoading(
      this.downloadGitRepo,
      DOWNLOAD_MESSAGE,
      requestUrl,
      path.resolve(process.cwd(), this.targetDir),
      { clone: true }
    );
  }

  // 核心创建逻辑
  async create() {
    // 1. 获取模版名称
    const repo = await this.getRepo();

    // 2. 获取branch名称
    const branch = await this.getBranch(repo);
    console.log(branch, '获取branch名称---------');

    // 3. 下载模版到目录
    await this.download(repo, branch);

    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)} \r\n cd ${chalk.cyan(this.name)}  \r\n npm install`);
  }
}

module.exports = Generator;
