// 补零
function format(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }
  return num.toString();
}

/**
 * 时间戳格式化函数，统一输出为 yyyy/mm/dd HH:mm:ss 格式
 * @param timestamp
 */
function dateFormat(timestamp: number | string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = format(date.getMonth() + 1);
  const day = format(date.getDate());
  const hour = format(date.getHours());
  const minute = format(date.getMinutes());
  const second = format(date.getSeconds());
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

export default dateFormat;
