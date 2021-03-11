/**
 * 服务信息实体
 */
import { Column, Entity, OneToMany } from 'typeorm';
import { ServicesApiEntity } from './service-api.entity';
import { ServicesDependencyEntity } from './service-dependency.entity';
import { BaseEntity } from 'src/modules/base.entity';
@Entity({ name: 'service_info' })
export class ServicesInfoEntity extends BaseEntity {
  // 项目服务
  @Column({
    type: 'varchar',
    length: 64,
    comment: '服务名称，对应生成SpringBoot工程的名称',
  })
  name: string;

  // 服务基础url
  @Column({
    type: 'varchar',
    length: 64,
    comment: '为所有该服务下接口的URL添加前缀',
    default: '',
  })
  url: string;

  // 服务端口号
  @Column({
    type: 'int',
    name: 'server_port',
    comment: '服务启动监听端口号',
    default: null,
  })
  serverPort: number;

  // 服务部署id
  @Column({
    type: 'varchar',
    name: 'depoly_id',
    comment: '服务部署在运行平台id',
    default: null,
  })
  depolyId: string;

  // 依赖的模型id
  @Column({
    type: 'varchar',
    name: 'module_dependency_id',
    comment: '依赖的主模型id，附模型需要根据主模型进行关联',
    default: null,
  })
  moduleDependencyId: string;

  // 托管信息/服务代码
  @Column({
    type: 'varchar',
    comment: '比如：git、svn地址',
    default: null,
  })
  deposit: string;

  // 服务状态
  @Column({
    type: 'tinyint',
    comment: '是否初始化，决定是否要追加更新',
    default: 0,
  })
  status: number;

  // 服务描述
  @Column({
    type: 'varchar',
    default: '',
  })
  description: string;

  // 版本号/修改次数
  @Column({
    type: 'int',
    comment: '要素字段-系统维护',
    default: null,
  })
  version: number;

  // 负责人
  @Column({
    type: 'varchar',
    length: 64,
    default: null,
  })
  owner: string;

  // 是否纯继承
  @Column({
    type: 'tinyint',
    name: 'is_all_by_extend',
    default: null,
  })
  isAllByExtend: number;

  // 继承版本
  @Column({
    type: 'varchar',
    length: 64,
    name: 'extand_version',
    default: null,
  })
  extandVersion: string;

  // 分类
  @Column({
    type: 'varchar',
    length: 64,
    default: '',
  })
  classification: string;

  // 标签
  @Column({
    type: 'varchar',
    default: '',
  })
  tag: string;

  // 代码质量
  @Column({
    type: 'varchar',
    name: 'code_quality',
    default: '',
  })
  codeQuality: string;

  // 服务级别
  @Column({
    type: 'varchar',
    name: 'service_rank',
    default: '',
  })
  serviceRank: string;

  // 服务地址/swagger地址
  @Column({
    type: 'varchar',
    name: 'service_Api_url',
    default: '',
  })
  serviceApiUrl: string;

  // Druid地址
  @Column({
    type: 'varchar',
    name: 'druid_url',
    default: '',
  })
  druidUrl: string;

  // 启动时间
  @Column({
    type: 'datetime',
    name: 'start_time',
    default: null,
  })
  startTime: Date;

  // 克隆源
  @Column({
    type: 'varchar',
    name: 'clone_by',
    default: '',
  })
  cloneBy: string;

  @OneToMany(() => ServicesApiEntity, api => api.serviceId)
  apis: ServicesApiEntity[];

  @OneToMany(() => ServicesDependencyEntity, dependency => dependency.serviceId)
  dependencies: ServicesDependencyEntity[];
}
