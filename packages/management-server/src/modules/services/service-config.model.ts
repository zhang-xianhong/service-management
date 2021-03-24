/**
 * 服务配置表
 */
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesInfoModel } from './service-info.model';

@Table({
  tableName: 'service_config',
})
export class ServicesConfigModel extends BaseModel {
  // 隶属服务
  @ForeignKey(() => ServicesInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'service_id',
  })
  serviceId: number;

  @BelongsTo(() => ServicesInfoModel)
  serviceInfo: ServicesInfoModel;

  // 配置信息
  @Column({
    type: DataType.JSON,
  })
  config: JSON;
}

/**
 * @example
 * service_info response
 *
 * export const details = {
  // ...其他serviceDetails
    config: {
      coordinate: {
        1: {
          x: 0,
          y: 0,
        },
      },
    },
  };
*/

