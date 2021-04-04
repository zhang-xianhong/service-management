/**
 * 项目实体
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ModelsInfoModel } from '../models/models-info.model';
import { METHOD_TYPE } from './default-apis';
import { ServicesApiParamModel } from './service-api-param.model';
import { ServicesInfoModel } from './service-info.model';

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
    type: DataType.TINYINT,
    field: 'method_type',
    defaultValue: METHOD_TYPE.GET,
    comment: '0:GET，1:POST，3:PUT',
  })
  method: METHOD_TYPE;

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

  // 隶属模型
  @ForeignKey(() => ModelsInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'model_id',
  })
  modelId: number;

  @BelongsTo(() => ModelsInfoModel)
  model: ModelsInfoModel;

  @HasMany(() => ServicesApiParamModel)
  params: ServicesApiParamModel[];


  // 是否系统自动生产接口
  @Column({
    type: DataType.TINYINT,
    defaultValue: 0,
    field: 'is_system',
  })
  isSystem: number;
}
