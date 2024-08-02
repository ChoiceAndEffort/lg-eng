/*
 * @Author: lg
 * @Date: 2024-07-04 09:47:50
 * @LastEditors: lg
 * @LastEditTime: 2024-08-02 17:49:23
 * @Description:
 * @FilePath: \lg-ui-vue\components\name-avatar\index.ts
 */
import { App } from 'vue';
//名字头像
import LgNameAvatar from './src/main.vue';

export { LgNameAvatar };
export default {
  install(app: App) {
    app.component('lg-name-avatar', LgNameAvatar);
  }
};
