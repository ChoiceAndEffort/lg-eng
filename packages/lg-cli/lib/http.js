/*
 * @Author: lg
 * @Date: 2024-01-15 19:59:11
 * @LastEditors: lg
 * @LastEditTime: 2024-01-16 10:47:33
 * @Description:
 * @FilePath: \lg-cli\lib\http.js
 */
const axios = require('axios');
const https = require('https');
axios.interceptors.response.use((res) => {
  return res.data;
});

const agent = new https.Agent({
  rejectUnauthorized: false
});

// 获取模版列表
async function getRepoList() {
  const url = 'https://api.github.com/users/leigong421/repos';
  return axios.get(url, {
    httpsAgent: agent
  });
}

// 获取分支信息
async function getBranchList(repo) {
  const url = ` https://api.github.com/repos/leigong421/egg-back/branches`;
  return axios.get(url, {
    httpsAgent: agent
  });
}

module.exports = {
  getRepoList,
  getBranchList
};
