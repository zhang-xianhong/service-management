/**
 * 项目实体
 */
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServicesInfoEntity } from './service-info.entity';

export enum methodType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}

export enum paramType {
  RequestBody = 'REQUEST_BODY',
  PathVariable = 'PATH_VARIABLE',
  PequestParam = 'REQUEST_PARAM'
}

@Entity({ name: 'service_api' })
export class ServicesApiEntity extends BaseEntity {
  // 自增ID
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 接口URL
  @Column({
    type: 'varchar',
    length: 64,
    comment: '接口的URL，会映射为接口的方法名和RequestMapping',
  })
  url: string;

  // 请求方式
  @Column({
    type: 'enum',
    enum: methodType,
    name: 'method_type',
    default: methodType.Get,
  })
  method: methodType;

  // 参数类型
  @Column({
    type: 'enum',
    enum: paramType,
    name: 'param_type',
    default: paramType.PequestParam,
  })
  paramType: paramType;

  // 接口名称
  @Column({
    type: 'varchar',
  })
  name: string;

  // 接口描述
  @Column({
    type: 'varchar',
    nullable: true,
    default: '',
  })
  description: string;

  // 隶属服务
  @ManyToOne(() => ServicesInfoEntity, info => info.id)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: number;

  // 版本号
  @Column({
    type: 'int',
    nullable: true,
    default: 0,
  })
  version: number;

  // 是否删除
  @Column({
    name: 'is_delete',
    type: 'tinyint',
    width: 1,
    default: 0,
    select: false,
  })
  isDelete: number;
}
