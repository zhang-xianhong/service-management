// 表单内按钮配置数据接口
export default interface ButtonOptionInterface {
  name: string;
  label?: string;
  eventName?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';
  trigger?: 'hover' | 'click' | 'dbclick' | 'focus';
  size?: string;
  visibility?: boolean | Function;
  [key: string]: unknown;
}
