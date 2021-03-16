/**
 * 服务信息实体
 */
import { Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { ServicesApiModel } from './service-api.model';
import { ServicesDependencyModel } from './service-dependency.model';
@Table({
  timestamps: false,
  tableName: 'service_info',
})
export class ServicesInfoModel extends BaseModel  {
  // 项目服务
  @Column({
    type: DataType.STRING,
    comment: '服务名称，对应生成SpringBoot工程的名称',
  })
  name: string;

  // 服务基础url
  @Column({
    type: DataType.STRING,
    comment: '为所有该服务下接口的URL添加前缀',
    defaultValue: '',
  })
  url: string;

  // 服务端口号
  @Column({
    type: DataType.INTEGER,
    field: 'server_port',
    comment: '服务启动监听端口号',
    defaultValue: null,
  })
  serverPort: number;

  // 服务部署id
  @Column({
    type: DataType.STRING,
    field: 'depoly_id',
    comment: '服务部署在运行平台id',
    defaultValue: null,
  })
  depolyId: string;

  // 依赖的模型id
  @Column({
    type: DataType.STRING,
    field: 'module_dependency_id',
    comment: '依赖的主模型id，附模型需要根据主模型进行关联',
    defaultValue: null,
  })
  moduleDependencyId: string;

  // 托管信息/服务代码
  @Column({
    type: DataType.STRING,
    comment: '比如：git、svn地址',
    defaultValue: null,
  })
  deposit: string;

  // 服务状态
  @Column({
    type: DataType.TINYINT,
    comment: '是否初始化，决定是否要追加更新',
    defaultValue: 0,
  })
  status: number;

  // 服务描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 版本号/修改次数
  @Column({
    type: DataType.INTEGER,
    comment: '要素字段-系统维护',
    defaultValue: null,
  })
  version: number;

  // 负责人
  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  owner: string;

  // 是否纯继承
  @Column({
    type: DataType.TINYINT,
    field: 'is_all_by_extend',
    defaultValue: null,
  })
  isAllByExtend: number;

  // 继承版本
  @Column({
    type: DataType.STRING,
    field: 'extend_version',
    defaultValue: null,
  })
  extendVersion: string;

  // 分类
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  classification: string;

  // 标签
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  tag: string;


  // 初始化次数
  @Column({
    type: DataType.INTEGER,
    field: 'init_times',
    defaultValue: 0,
  })
  initTimes: number;

  // 构建次数
  @Column({
    type: DataType.INTEGER,
    field: 'built_times',
    defaultValue: 0,
  })
  builtTimes: number;

  // 代码质量
  @Column({
    type: DataType.STRING,
    field: 'code_quality',
    defaultValue: '',
  })
  codeQuality: string;

  // 服务级别
  @Column({
    type: DataType.STRING,
    field: 'service_rank',
    defaultValue: '',
  })
  serviceRank: string;

  // 服务地址/swagger地址
  @Column({
    type: DataType.STRING,
    field: 'service_Api_url',
    defaultValue: '',
  })
  serviceApiUrl: string;

  // Druid地址
  @Column({
    type: DataType.STRING,
    field: 'druid_url',
    defaultValue: '',
  })
  druidUrl: string;

  // 启动时间
  @Column({
    type: DataType.DATE,
    field: 'start_time',
    defaultValue: null,
  })
  startTime: Date;

  // 克隆源
  @Column({
    type: DataType.STRING,
    field: 'clone_by',
    defaultValue: '',
  })
  cloneBy: string;

  @HasMany(() => ServicesApiModel)
  apis: ServicesApiModel[];

  @HasMany(() => ServicesDependencyModel)
  dependencies: ServicesDependencyModel[];
}
