/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesInfoModel } from './service-info.entity';

@Table({
  timestamps: false,
  tableName: 'service_dependency',
})
export class ServicesDependencyModel extends BaseModel<ServicesDependencyModel> {
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

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;

  // 隶属服务
  @ForeignKey(() => ServicesInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
  })
  serviceId: number;

  @BelongsTo(() => ServicesInfoModel)
  serviceInfo: ServicesInfoModel;

  // @ManyToOne(() => ServicesInfoEntity, info => info.id)
  // @JoinColumn({
  //   name: 'dependency_id',
  //   referencedColumnName: 'id',
  // })
  // service: ServicesInfoEntity;
}
