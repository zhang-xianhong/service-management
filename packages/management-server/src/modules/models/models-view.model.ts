import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'model_view',
  comment: '用于记录模型视图的坐标值',
})

export class ModelsInfoModel extends BaseModel {
  @Column({
    type: DataType.FLOAT,
    field: 'x_axis',
    comment: '横坐标',
  })
  xAxis: number;

  @Column({
    type: DataType.FLOAT,
    field: 'y_axis',
    comment: '纵坐标',
  })
  yAxis: number;

  // 关联模型
  @Column({
    type: DataType.INTEGER,
    field: 'model_id',
    comment: '关联模型',
  })
  modelId: number;

  // 关联服务
  @Column({
    type: DataType.INTEGER,
    field: 'service_id',
    comment: '关联服务',
  })
  serviceId: number;
}
