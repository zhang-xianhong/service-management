import { Table, Column, DataType, Length, HasMany  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ModelsFieldsModel } from './models-fields.model';

@Table({
  timestamps: false,
  tableName: 'model_info',
})

export class ModelsInfoModel extends BaseModel {
  @Length({ min: 1, max: 64 })
  @Column({ type: DataType.STRING, comment: '模型名称，大驼峰格式' })
  name: string;

  @Length({ min: 1, max: 100 })
  @Column({ type: DataType.STRING, comment: '模型中文描述' })
  description: string;

  @Length({ min: 1, max: 255 })
  @Column({
    type: DataType.STRING,
    comment: '模型详情，备注信息',
  })
  remark: string;

  // 建表引擎
  @Column({
    type: DataType.STRING,
    defaultValue: 'innoDB',
  })
  engine: string;

  // 版本
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '版本号/修改次数',
  })
  version: number;

  // 负责人
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  owner: string;

  // 是否纯继承
  @Column({
    field: 'is_all_by_extend',
    type: DataType.BOOLEAN,
    comment: '是否纯继承',
    defaultValue: false,
  })
  isAllByExtend: boolean;

  // 对象级别
  @Column({
    field: 'model_rank',
    type: DataType.STRING,
    defaultValue: '',
    comment: '对象级别',
  })
  modelRank: string;

  // 分类
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  classification: string;

  // 标签
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  tags: string;

  // 相似对象
  @Column({
    field: 'similar_object',
    type: DataType.STRING,
    defaultValue: '',
    comment: '相似对象',
  })
  similarObject: string;

  // 相似度
  @Column({
    type: 'float',
    defaultValue: null,
  })
  similarity: number;

  // 克隆源
  @Column({
    field: 'clone_by',
    type: DataType.STRING,
    defaultValue: '',
  })
  cloneBy: string;

  // 启动时间
  @Column({
    type: DataType.DATE,
    field: 'start_time',
    defaultValue: null,
    comment: '启动时间',
  })
  startTime: number;

  @HasMany(() => ModelsFieldsModel)
  fields: ModelsFieldsModel;
}
