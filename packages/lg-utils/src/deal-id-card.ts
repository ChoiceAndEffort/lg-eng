/**
 * @description: 隐藏身份证号中间几位
 * @param {string |number} value
 * @return {string}
 */
export const idCardDesensitization = (value: string | number): string => {
  return value.toString().replace(/^(.{4})(?:\d+)(.{4})$/, '$1**********$2');
};
