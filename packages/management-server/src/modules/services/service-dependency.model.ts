/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesInfoModel } from './service-info.model';

@Table({
  timestamps: false,
  tableName: 'service_dependency',
})
export class ServicesDependencyModel extends BaseModel {
  // 依赖服务
  @Column({
    type: DataType.BIGINT,
    field: 'dependency_id',
    defaultValue: null,
  })
  dependencyId: number;

  // 备注
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  remark: string;

  // 隶属服务
  @ForeignKey(() => ServicesInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
  })
  serviceId: number;

  @BelongsTo(() => ServicesInfoModel)
  serviceInfo: ServicesInfoModel;
}
