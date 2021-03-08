/**
 * 项目实体
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 项目名称
  @Column({
    type: 'varchar',
    length: 64,
    default: '',
  })
  name: string;

  // 描述
  @Column({
    type: 'varchar',
    length: 64,
    default: '',
  })
  description: string;

  // 状态
  @Column('int')
  status: string;

  // 是否只读
  @Column({
    type: 'boolean',
    name: 'read_nly',
  })
  readOnly: boolean;

  // 代码生成器类型
  @Column({
    type: 'varchar',
    name: 'generator_type',
    default: '',
  })
  generatorType: string;

  // 负责人
  @Column({
    type: 'varchar',
    default: '',
  })
  owner: string;

  // 代码质量
  @Column({
    type: 'varchar',
    name: 'code_quality',
    default: '',
  })
  codeQuality: string;

  // 级别名称
  @Column({
    type: 'varchar',
    name: 'level_name',
    default: '',
  })
  levelName: string;

  // 级别
  @Column({
    type: 'int',
    default: null,
  })
  level: number;

  // 创建账号
  @Column({
    type: 'varchar',
    length: 64,
    name: 'create_user',
    default: '',
  })
  createUser: string;

  // 创建用户
  @Column({
    type: 'varchar',
    length: 64,
    name: 'create_user_name',
  })
  createUserName: string;

  // 创建日期
  @Column({
    type: 'datetime',
    name: 'create_date',
    default: () => 'NOW()',
  })
  createDate: Date;

  // 更新账号
  @Column({
    type: 'varchar',
    length: 64,
    name: 'update_user',
    default: '',
  })
  updateUser: string;

  // 更新用户
  @Column({
    type: 'varchar',
    length: 64,
    name: 'update_user_name',
    default: '',
  })
  updateUserName: string;

  // 更新日期
  @Column({
    type: 'datetime',
    name: 'update_date',
    default: null,
  })
  updateDate: Date;

  // 更新次数
  @Column({
    type: 'int',
    default: 0,
  })
  version: number;

  // 数据库IP
  @Column({
    type: 'varchar',
    name: 'database_ip',
    default: '',
  })
  databaseIp: string;

  // 数据库端口
  @Column({
    type: 'varchar',
    name: 'database_port',
    default: '',
  })
  databasePort: string;

  // 数据库名称
  @Column({
    type: 'varchar',
    name: 'database_name',
    default: '',
  })
  databaseName: string;

  // 数据库用户
  @Column({
    type: 'varchar',
    name: 'database_user_name',
    default: '',
  })
  databaseUserName: string;

  // 数据库密码
  @Column({
    type: 'varchar',
    name: 'database_user_password',
    default: '',
  })
  databaseUserPassword: string;

  // TOKEN
  @Column({
    type: 'varchar',
    default: '',
  })
  token: string;

  // 已分配用户
  @Column({
    type: 'varchar',
    default: '',
  })
  assigned: string;

  // 每日冻结时段
  @Column({
    type: 'varchar',
    name: 'freeze_hours',
    default: '',
  })
  freezeHours: string;

  // 开放微对象给项目
  @Column({
    type: 'varchar',
    name: 'can_access_micro_objects',
    default: '',
  })
  canAccessMicroObjects: string;

  // 开放微服务给项目
  @Column({
    type: 'varchar',
    name: 'can_access_micro_services',
    default: '',
  })
  canAccessMicroServices: string;

  // 开放微模块给项目
  @Column({
    type: 'varchar',
    name: 'can_access_micro_modules',
    default: '',
  })
  canAccessMicroModules: string;

  // 能访问微对象的项目
  @Column({
    type: 'varchar',
    name: 'open_micro_object_to_projects',
    default: '',
  })
  openMicroObjectToProjects: string;

  // 能访问微服务的项目
  @Column({
    type: 'varchar',
    name: 'open_micro_service_to_projects',
    default: '',
  })
  openMicroServiceToProjects: string;

  // 能访问微模块的项目
  @Column({
    type: 'varchar',
    name: 'open_micro_module_to_projects',
    default: '',
  })
  openMicroModuleToProjects: string;

  // 删除
  @Column({
    type: 'int',
    default: 0,
  })
  isDelete: number;
}
