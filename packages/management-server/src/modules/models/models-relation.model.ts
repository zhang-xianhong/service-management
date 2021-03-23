import { Table, Column, DataType } from 'sequelize-typescript';
import { MODEL_RELATION_TYPES } from 'src/shared/constants/model-relation-types';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'model_relation',
  comment: '用于记录模型间的关系',
})

export class ModelsRelationModel extends BaseModel {
  // 关联服务
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
    comment: '关联服务',
  })
  serviceId: number;

  // 从模型
  @Column({
    type: DataType.BIGINT,
    field: 'from_model_id',
    comment: '从模型',
  })
  fromModelId: number;

  // 主模型
  @Column({
    type: DataType.BIGINT,
    field: 'to_model_id',
    comment: '主模型',
  })
  toModelId: number;

  // 关系类型
  @Column({
    type: DataType.TINYINT,
    field: 'relation_type',
    comment: '模型关系, 0: 1-1, 1: 1-N, 2: N-N',
    defaultValue: MODEL_RELATION_TYPES.ONE_TO_ONE,
  })
  relationType: MODEL_RELATION_TYPES;

  // 关联外键
  @Column({
    type: DataType.STRING,
    field: 'by_field_id',
    comment: '冗余字段，模型是通过哪个外键关联的',
  })
  byFieldId: string;
}
