export const statusMap = {
  0: '未初始化',
  10: '变更中',
  11: '变更成功',
  12: '变更失败',
  20: '启动中',
  21: '启动成功',
  22: '启动失败',
  31: '停止成功',
  32: '停止失败',
};
export const initMap = {
  0: '未初始化',
  10: '初始化中',
  11: '初始化成功',
  12: '初始化失败',
  20: '启动中',
  21: '启动成功',
  22: '启动失败',
  31: '停止成功',
  32: '停止失败',
};

export const buttonMap = {
  0: '初始化',
  10: '同步变更',
  11: '同步变更',
  12: '同步变更',
  20: '同步变更',
  21: '同步变更',
  22: '同步变更',
  31: '同步变更',
  32: '同步变更',
};

export const buttonIintMap = {
  0: '初始化',
  10: '初始化',
  11: '同步变更',
  12: '同步变更',
  20: '同步变更',
  21: '同步变更',
  22: '同步变更',
  31: '同步变更',
  32: '同步变更',
};
export const statusColor = {
  0: '#D7D7D7',
  10: '#FF9D00',
  11: '#0ABF5B',
  12: '#E54545',
  20: '#FF9D00',
  21: '#0ABF5B',
  22: '#E54545',
  31: '#E54545',
  32: '#0ABF5B',
};

export const computeStatusLabel = (initIime: number) => {
  if (initIime) {
    return statusMap;
  }
  return initMap;
};
