/**
 * 项目实体
 */
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServicesInfoEntity } from './services-info.entity';

@Entity({ name: 'services_dependency' })
export class ServicesDependencyEntity extends BaseEntity {
  // 自增ID
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 依赖服务
  @Column({
    type: 'bigint',
    name: 'dependency_id',
    default: null,
  })
  dependencyId: number;

  // 备注
  @Column({
    type: 'varchar',
    nullable: true,
    default: '',
  })
  remark: string;

  // 版本号
  @Column({
    type: 'int',
    nullable: true,
    default: 0,
  })
  version: number;

  // 主服务
  @ManyToOne(() => ServicesInfoEntity, info => info.id)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: number;

  // 是否删除
  @Column({
    name: 'is_delete',
    type: 'tinyint',
    width: 1,
    default: 0,
    select: false,
  })
  isDelete: number;

  @ManyToOne(() => ServicesInfoEntity, info => info.id)
  @JoinColumn({
    name: 'dependency_id',
    referencedColumnName: 'id',
  })
  service: ServicesInfoEntity;
}
