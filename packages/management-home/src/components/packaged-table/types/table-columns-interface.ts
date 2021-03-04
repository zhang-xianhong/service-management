interface ButtonOptionInterface {
  name?: string;
  label?: string;
  eventName?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text';
  size?: string;
  [key: string]: unknown;
}

// 表格列配置数据接口
export default interface TableColumnsInterface {
  prop: string;
  label: string;
  width?: string;
  fixed?: boolean;
  isDefault?: boolean;
  isButton?: boolean;
  buttonOptions?: Array<ButtonOptionInterface>;
  [key: string]: unknown;
}
