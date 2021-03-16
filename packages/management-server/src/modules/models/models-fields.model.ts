import { Table, Column, DataType, ForeignKey, BelongsTo, Length  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ModelsInfoModel } from './models-info.model';

@Table({
  timestamps: false,
  tableName: 'model_field',
})
export class ModelsFieldsModel extends BaseModel {
  // 管理模型ID
  @ForeignKey(() => ModelsInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'model_id',
  })
  modelId: number;

  @BelongsTo(() => ModelsInfoModel)
  info: ModelsInfoModel;

  // 字段名称
  @Length({ min: 1, max: 64 })
  @Column({ type: DataType.STRING })
  name: string;

  // 关联数据类型ID
  @Column({
    field: 'type_id',
    type: DataType.STRING,
    comment: '关联数据类型ID, 方便前端回读',
  })
  typeId: string;

  // 数据类型
  @Column({
    type: DataType.STRING,
  })
  type: string;

  // 字段描述
  @Column({
    type: 'tinytext',
  })
  description: string;

  // 字段顺序号
  @Column({
    type: DataType.INTEGER,
    field: 'field_order',
    defaultValue: 0,
    comment: '决定属性的排序，从0依次递减',
  })
  fieldOrder: number;

  // 字段长度
  @Column({
    type: DataType.INTEGER,
    defaultValue: 10000,
    comment: '字段长度',
  })
  length: number;

  // 字段长度
  @Column({
    type: DataType.STRING,
    defaultValue: '',
    field: 'default_value',
    comment: '默认值',
  })
  defaultValue: string;

  // 是否主键
  @Column({
    field: 'is_key',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isKey: boolean;

  // 是否查询条件
  @Column({
    field: 'is_query',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isQuery: boolean;

  // 是否展示
  @Column({
    field: 'is_show',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '是否展示',
  })
  isShow: boolean;

  // 是否列表
  @Column({
    field: 'is_show_list',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '是否列表',
  })
  isShowList: boolean;

  // 查询类型
  @Column({
    field: 'query_mode',
    type: DataType.STRING,
    defaultValue: 'single',
    comment: '查询类型',
  })
  queryMode: string;

  // 是否只读
  @Column({
    field: 'read_only',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  readOnly: boolean;

  // 是否可为空
  @Column({
    field: 'not_null',
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  notNull: boolean;

  // 扩展信息
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  extra: string;

  // 外联模型ID
  @Column({
    type: DataType.STRING,
    field: 'foreign_model_id',
    defaultValue: null,
    comment: '外联模型ID',
  })
  foreignModelId: string;

  // 外联字段ID
  @Column({
    type: DataType.STRING,
    field: 'foreign_id',
    defaultValue: null,
    comment: '外联字段ID',
  })
  foreignId: string;

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;

  // 是否系统字段
  @Column({
    field: 'is_system',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '是否系统字段',
  })
  isSystem: boolean;

  // 是否唯一
  @Column({
    field: 'is_unique',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isUnique: boolean;

  // 是否索引
  @Column({
    field: 'is_index',
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isIndex: boolean;

  // 分词
  @Column({
    field: 'is_participle_support',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '分词支持',
  })
  isParticipleSupport: boolean;

  // 拼音
  @Column({
    field: 'is_pinyin_support',
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '拼音支持',
  })
  isPinyinSupport: boolean;
}
