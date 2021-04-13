import { Table, Column, DataType, HasMany, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { OwnersModel } from '../owners/owners.model';
import { ServicesInfoModel } from '../services/service-info.model';
import { ModelsFieldsModel } from './models-fields.model';

@Table({
  timestamps: false,
  tableName: 'model_info',
})

export class ModelsInfoModel extends BaseModel {
  @Column({ type: DataType.STRING, comment: '模型名称，大驼峰格式' })
  name: string;

  @Column({ type: DataType.STRING, comment: '模型中文描述' })
  description: string;

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
    type: DataType.FLOAT,
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

  @HasMany(() => ModelsFieldsModel, {
    foreignKey: 'modelId',
    constraints: false,
    foreignKeyConstraint: false,
  })
  fields: ModelsFieldsModel;

  // 关联服务
  @ForeignKey(() => ServicesInfoModel)
  @Column({
    type: DataType.INTEGER,
    field: 'service_id',
    comment: '关联服务',
  })
  serviceId: number;

  // owners
  @HasMany(() => OwnersModel, 'moduleId')
  owners: OwnersModel[];
}
