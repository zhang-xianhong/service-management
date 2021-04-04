import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'model_field_history',
})
export class ModelsFieldsHistoryModel extends BaseModel {
  // 服务ID
  @Column({
    type: DataType.BIGINT,
  })
  serviceId: number;

  // 模型ID
  @Column({
    type: DataType.BIGINT,
  })
  modelId: number;

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  fieldVersion: number;

  // 内容
  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  content: JSON;
}
