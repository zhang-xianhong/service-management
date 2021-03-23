/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesApiParamModel } from './service-api-param.model';
import { ServicesInfoModel } from './service-info.model';

export enum methodType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}
@Table({
  timestamps: false,
  tableName: 'service_api',
})
export class ServicesApiModel extends BaseModel {
  // 接口URL
  @Column({
    type: DataType.STRING,
    comment: '接口的URL，会映射为接口的方法名和RequestMapping',
  })
  url: string;

  // 请求方式
  @Column({
    type: DataType.STRING,
    field: 'method_type',
    defaultValue: methodType.Get,
  })
  method: methodType;

  // 接口名称
  @Column({
    type: DataType.STRING,
  })
  name: string;

  // 接口描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 隶属服务
  @ForeignKey(() => ServicesInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
  })
  serviceId: number;

  @BelongsTo(() => ServicesInfoModel)
  serviceInfo: ServicesInfoModel;

  @HasMany(() => ServicesApiParamModel)
  params: ServicesApiParamModel[];

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;

  // 是否系统自动生产接口
  @Column({
    type: DataType.TINYINT,
    defaultValue: 0,
    field: 'is_system',
  })
  isSystem: number;
}
