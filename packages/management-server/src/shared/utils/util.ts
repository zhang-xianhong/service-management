export const getTreeArr = (obj) => {
  if (!Array.isArray(obj.data)) {
    console.log('getTreeArr=>请传入数组');
    return [];
  }
  const arr =  obj.data;
  const treeArray = [];      // 将数据处理成数状结构
  arr.forEach((item) => {
    let index = 0;
    // eslint-disable-next-line no-param-reassign
    item.children = [];
    if (!item.isDelete) {
      arr.forEach((item1) => {
        // 得到树结构关系
        if (item[obj.key] === item1[obj.pKey] && !item1.isDelete) {
          item.children.push(item1);
        }
        // 判断根节点
        if (item1[obj.key] !== item[obj.pKey]) {
          index += 1;
        }
      });
      // 没传入根节点，根据当前数据结构得到根节点
      if (!('rootPValue' in obj) && index === arr.length) {
        treeArray.push(item);
      }
    }
  });
  // 传入根节点，根据传入的根节点组成树结构
  if ('rootPValue' in obj) {
    arr.forEach((item) => {
      if (item[obj.pKey] === obj.rootPValue) {
        treeArray.push(item);
      }
    });
  } return treeArray;
};
