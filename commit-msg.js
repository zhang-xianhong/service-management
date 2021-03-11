/* commit-msg信息
*/

const fs = require('fs');
// 获取命令参数路径
const param = process.argv[process.argv.length - 1]; // 获取git commit消息临时存放文件地址
// 读取msg 
let contentsStr = fs.readFileSync(param).toString();
contentsStr = contentsStr.trim();
//用户提交的msg格式
const customTypeArr = ["--bug", "--story", "--task"];
const customType = contentsStr.split('=')[0];
// 标准的格式
const standardTypeArr = ['upd', 'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert'];
const standardType = contentsStr.split(':')[0];
if (standardTypeArr.indexOf(standardType) > -1) {
  // 正常退出
  process.exit(0);
}
if (customTypeArr.indexOf(customType) > -1) {
  // 组装新的msg
  if (customType === customTypeArr[0]) {
    contentsStr = 'fix: ' + contentsStr;
  } else {

    contentsStr = 'feat: ' + contentsStr;
  }
  // 写参数内容
  fs.writeFileSync(param, contentsStr);
  // 正常退出
  process.exit(0);
} else {
  console.log('\x1B[31m', 'type must be one of [--bug, --story, --task]');
  process.exit(1);
}