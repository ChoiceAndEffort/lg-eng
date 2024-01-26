/**
 * @description: 金钱科学计数法
 * @param {string| number} value
 * @return {*}string
 */
export const moneyFormat = (value: string | number): string => {
  let str = Number(value).toFixed(2);
  str = `${str
    .substring(0, str.indexOf('.'))
    .replace(/(?!^)(?=(\d{3})+$)/g, ',')}.${str.replace(/\d+\.(\d*)/, '$1')}`;
  return str;
};
