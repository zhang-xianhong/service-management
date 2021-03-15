import { Column,  Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../base.entity';
import { ModelsInfoEntity } from './models-info.entity';

@Entity({ name: 'model_field' })
export class ModelsFieldsEntity extends BaseModel<ModelsFieldsEntity> {
  // 管理模型ID
  @ManyToOne(() => ModelsInfoEntity, model => model.id)
  @JoinColumn({
    name: 'model_id',
  })
  modelId: number;

  // 字段名称
  @Column({ length: 64 })
  name: string;

  // 关联数据类型ID
  @Column({
    name: 'type_id',
    type: 'varchar',
    comment: '关联数据类型ID, 方便前端回读',
  })
  typeId: string;

  // 数据类型
  @Column({
    type: 'varchar',
  })
  type: string;

  // 字段描述
  @Column({
    type: 'tinytext',
  })
  description: string;

  // 字段顺序号
  @Column({
    type: 'int',
    name: 'field_order',
    default: 0,
    comment: '决定属性的排序，从0依次递减',
  })
  fieldOrder: number;

  // 字段长度
  @Column({
    type: 'int',
    default: 10000,
    comment: '字段长度',
  })
  length: number;

  // 字段长度
  @Column({
    type: 'varchar',
    default: '',
    name: 'default_value',
    comment: '默认值',
  })
  defaultValue: string;

  // 是否主键
  @Column({
    name: 'is_key',
    type: 'bool',
    width: 1,
    default: false,
  })
  isKey: boolean;

  // 是否查询条件
  @Column({
    name: 'is_query',
    type: 'bool',
    width: 1,
    default: false,
  })
  isQuery: boolean;

  // 是否展示
  @Column({
    name: 'is_show',
    type: 'bool',
    width: 1,
    default: false,
    comment: '是否展示',
  })
  isShow: boolean;

  // 是否列表
  @Column({
    name: 'is_show_list',
    type: 'bool',
    width: 1,
    default: false,
    comment: '是否列表',
  })
  isShowList: boolean;

  // 查询类型
  @Column({
    name: 'query_mode',
    type: 'varchar',
    default: 'single',
    comment: '查询类型',
  })
  queryMode: string;

  // 是否只读
  @Column({
    name: 'read_only',
    type: 'bool',
    width: 1,
    default: false,
  })
  readOnly: boolean;

  // 是否可为空
  @Column({
    name: 'not_null',
    type: 'bool',
    width: 1,
    default: true,
  })
  notNull: boolean;

  // 扩展信息
  @Column({
    type: 'varchar',
    default: '',
  })
  extra: string;

  // 外联模型ID
  @Column({
    type: 'varchar',
    name: 'foreign_model_id',
    default: null,
    comment: '外联模型ID',
  })
  foreignModelId: string;

  // 外联字段ID
  @Column({
    type: 'varchar',
    name: 'foreign_id',
    default: null,
    comment: '外联字段ID',
  })
  foreignId: string;

  // 版本号
  @Column({
    type: 'int',
    default: 0,
  })
  version: number;

  // 是否系统字段
  @Column({
    name: 'is_system',
    type: 'bool',
    width: 1,
    default: false,
    comment: '是否系统字段',
  })
  isSystem: boolean;

  // 是否唯一
  @Column({
    name: 'is_unique',
    type: 'boolean',
    width: 1,
    default: false,
  })
  isUnique: boolean;

  // 是否索引
  @Column({
    name: 'is_index',
    type: 'boolean',
    width: 1,
    default: false,
  })
  isIndex: boolean;

  // 分词
  @Column({
    name: 'is_participle_support',
    type: 'boolean',
    width: 1,
    default: false,
    comment: '分词支持',
  })
  isParticipleSupport: boolean;

  // 拼音
  @Column({
    name: 'is_pinyin_support',
    type: 'boolean',
    width: 1,
    default: false,
    comment: '拼音支持',
  })
  isPinyinSupport: boolean;
}
