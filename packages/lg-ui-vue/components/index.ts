/*
 * @Author: lg
 * @Date: 2024-07-29 17:16:21
 * @LastEditors: lg
 * @LastEditTime: 2024-08-02 18:05:11
 * @Description: 
 * @FilePath: \lg-eng\packages\lg-ui-vue\components\index.ts
 */

import './styles/index.scss';

import { App } from 'vue';

import LgNameAvatar from './name-avatar';
import LgSelectDepartmentPerson from './select-department-person';
import LgVerificationCode from './verification-code';

const components = [LgNameAvatar, LgSelectDepartmentPerson,LgVerificationCode];

const install = (app: App) => {
  components.map((item) => {
    app.use(item);
  });
};

export { LgNameAvatar, LgSelectDepartmentPerson,LgVerificationCode };

export default {
  install
};
