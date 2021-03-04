// 表格操作配置数据接口
export default interface TableOperationInterface {
  name?: string;
  label?: string;
  eventName?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';
  size?: string;
  [key: string]: unknown;
}
