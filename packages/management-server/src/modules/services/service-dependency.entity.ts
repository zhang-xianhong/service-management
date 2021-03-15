/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, Model } from 'sequelize-typescript';
import { BaseEntity } from '../base.entity';
import { ServicesInfoEntity } from './service-info.entity';

@Table({
  timestamps: false,
  tableName: 'settings_dictionary',
})
export class ServicesDependencyEntity extends  Model<BaseEntity> {
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
  @ForeignKey(() => ServicesInfoEntity)
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
  })
  serviceId: number;

  @BelongsTo(() => ServicesInfoEntity)
  info: ServicesInfoEntity;

  // @ManyToOne(() => ServicesInfoEntity, info => info.id)
  // @JoinColumn({
  //   name: 'dependency_id',
  //   referencedColumnName: 'id',
  // })
  // service: ServicesInfoEntity;
}
