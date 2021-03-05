import ButtonOptionInterface from './table-button-interface';

// 表格列配置数据接口
export default interface TableColumnsInterface {
  prop: string;
  label: string;
  width?: string | number;
  fixed?: boolean;
  isDefault?: boolean;
  isButton?: boolean;
  isDate?: boolean;
  buttonOptions?: Array<ButtonOptionInterface>;
  [key: string]: unknown;
}
