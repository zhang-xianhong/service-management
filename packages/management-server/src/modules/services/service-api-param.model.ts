/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { PARAM_TYPE, TYPE } from './default-apis';
import { ServicesApiModel } from './service-api.model';

@Table({
  timestamps: false,
  tableName: 'service_api_param',
})
export class ServicesApiParamModel extends BaseModel {
  // 参数名称
  @Column({
    type: DataType.STRING,
    comment: '对应生成Controller的入口参数',
  })
  name: string;

  // 参数类型
  @Column({
    type: DataType.TINYINT,
    defaultValue: TYPE.String,
  })
  type: TYPE;

  // 参数类型
  @Column({
    type: DataType.TINYINT,
    field: 'param_type',
    defaultValue: PARAM_TYPE.REQUEST_PARAM,
  })
  paramType: PARAM_TYPE;

  // 参数默认值
  @Column({
    type: DataType.STRING,
    field: 'default_value',
  })
  defaultValue: string;

  // 是否必填
  @Column({
    type: DataType.TINYINT,
  })
  required: number;

  // 参数顺序号
  @Column({
    type: DataType.INTEGER,
    field: 'param_order',
  })
  paramOrder: number;

  // 参数描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 隶属接口
  @ForeignKey(() => ServicesApiModel)
  @Column({
    type: DataType.BIGINT,
    field: 'api_id',
  })
  apiId: number;

  @BelongsTo(() => ServicesApiModel)
  apiInfo: ServicesApiModel;

  // 版本号
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;
}
