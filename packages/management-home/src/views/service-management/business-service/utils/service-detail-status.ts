// 服务状态枚举
enum ServerStatusEnum {
  // 未初始化
  UNINITIALIZED,
  // 初始化中
  INITIALIZING,
  // 已初始化，未构建
  UN_BUILD,
  // 构建中
  BUILDING,
  // 已构建
  BUILT,
  // 初始化失败
  INITIALIZATION_FAILED,
  // 构建失败
  BUILD_FAILED,
}

interface ServerStatusInterface {
  color: string;
  label: string;
}

// 解析服务状态信息
export default function (status: number): ServerStatusInterface {
  switch (status) {
    case ServerStatusEnum.UNINITIALIZED:
      return {
        color: '#bbbbbb',
        label: '未初始化',
      };
    case ServerStatusEnum.INITIALIZING:
      return {
        color: 'orange',
        label: '初始化中',
      };
    case ServerStatusEnum.UN_BUILD:
      return {
        color: 'yellow',
        label: '已初始化',
      };
    case ServerStatusEnum.BUILDING:
      return {
        color: 'blue',
        label: '构建中',
      };
    case ServerStatusEnum.BUILT:
      return {
        color: 'blue',
        label: '已构建',
      };
    case ServerStatusEnum.INITIALIZATION_FAILED:
      return {
        color: '#bbbbbb',
        label: '初始化失败',
      };
    default:
      return {
        color: '#bbbbbb',
        label: '构建失败',
      };
  }
}
