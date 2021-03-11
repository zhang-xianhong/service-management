/**
 * 项目实体
 */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ServicesInfoEntity } from './service-info.entity';
import { BaseEntity } from 'src/modules/base.entity';

@Entity({ name: 'service_dependency' })
export class ServicesDependencyEntity extends BaseEntity {
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
    default: '',
  })
  remark: string;

  // 版本号
  @Column({
    type: 'int',
    default: 0,
  })
  version: number;

  // 主服务
  @ManyToOne(() => ServicesInfoEntity, info => info.id)
  @JoinColumn({
    name: 'service_id',
  })
  serviceId: number;

  @ManyToOne(() => ServicesInfoEntity, info => info.id)
  @JoinColumn({
    name: 'dependency_id',
    referencedColumnName: 'id',
  })
  service: ServicesInfoEntity;
}
