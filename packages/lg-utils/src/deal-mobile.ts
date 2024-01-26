/**
 * @description: 隐藏手机号中间四位
 * @param {string |number} value
 * @return {string}
 */
export const mobileDesensitization = (value: string | number): string => {
  return value.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
};

const PHONE_REGEX = /^[1][3-9]\d{9}$/;

/**
 * @description: 验证手机号
 * @param {string |number} value
 * @return { RegExp }  regexp
 */
export const mobileCheck = (
  value: string | number,
  regexp: RegExp = PHONE_REGEX
): boolean => {
  return regexp.test(value.toString());
};
