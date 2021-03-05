// 数据对象属性数据接口
interface DataFieldProperty {
  index: number;
  name: string;
  description: string;
  typeId: number | string;
  notNull: boolean;
  isUnique: boolean;
  isIndex: boolean;
  isParticipleSupport: boolean;
  isPinyinSupport: boolean;
  foreignId?: string;
  isSystem?: boolean;
}

export default DataFieldProperty;
