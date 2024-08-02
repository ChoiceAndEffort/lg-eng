/*
 * @Author: lg
 * @Date: 2024-07-04 09:47:50
 * @LastEditors: lg
 * @LastEditTime: 2024-07-29 18:03:33
 * @Description:
 * @FilePath: \lg-ui-vue\components\select-department-person\index.ts
 */
import { App } from 'vue';
//名字头像
import LgSelectDepartmentPerson from './src/main.vue';

export { LgSelectDepartmentPerson };
export default {
  install(app: App) {
    app.component('lg-select-department-person', LgSelectDepartmentPerson);
  }
};
