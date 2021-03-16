/**
 * 项目实体
 */
import { Table, Column, DataType, Length, ForeignKey, BelongsTo, IsUrl } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesInfoModel } from './service-info.entity';

export enum methodType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}

export enum paramType {
  RequestBody = 'REQUEST_BODY',
  PathVariable = 'PATH_VARIABLE',
  RequestParam = 'REQUEST_PARAM'
}

@Table({
  timestamps: false,
  tableName: 'service_api',
})
export class ServicesApiModel extends BaseModel {
  // 接口URL
  @Length({ min: 1, max: 64 })
  @IsUrl
  @Column({
    type: DataType.STRING,
    comment: '接口的URL，会映射为接口的方法名和RequestMapping',
  })
  url: string;

  // 请求方式
  @Column({
    type: DataType.ENUM,
    values: ['GET', 'POST', 'PUT'],
    field: 'method_type',
    defaultValue: 'GET',
  })
  method: string;

  // 参数类型
  @Column({
    type: DataType.ENUM,
    values: ['REQUEST_BODY', 'PATH_VARIABLE', 'REQUEST_PARAM'],
    field: 'param_type',
    defaultValue: 'REQUEST_PARAM',
  })
  paramType: string;

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

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;
}
