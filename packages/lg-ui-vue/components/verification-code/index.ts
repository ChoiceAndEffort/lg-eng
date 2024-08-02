/*
 * @Author: lg
 * @Date: 2024-07-04 09:47:50
 * @LastEditors: lg
 * @LastEditTime: 2024-08-02 18:00:41
 * @Description:
 * @FilePath: \lg-eng\packages\lg-ui-vue\components\verification-code-plugin\index.ts
 */
import { App } from 'vue';
//验证码
import LgVerificationCode from './src/main.vue';

export { LgVerificationCode };
export default {
  install(app: App) {
    app.component('lg-verification-code', LgVerificationCode);
  }
};
