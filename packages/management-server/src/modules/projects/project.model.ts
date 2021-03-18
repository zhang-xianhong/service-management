/**
 * 项目实体
 */
import { Table, Column, DataType, Length  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'project',
})
export class ProjectModel extends BaseModel {
  // 项目名称
  @Length({ min: 1, max: 64 })
  @Column({
    type: DataType.STRING,

    defaultValue: '',
  })
  name: string;

  // 描述
  @Length({ min: 1, max: 64 })
  @Column({
    type: DataType.STRING,

    defaultValue: '',
  })
  description: string;

  // 状态
  @Column('int')
  status: string;

  // 是否只读
  @Column({
    type: DataType.BOOLEAN,
    field: 'read_nly',
  })
  readOnly: boolean;

  // 代码生成器类型
  @Column({
    type: DataType.STRING,
    field: 'generator_type',
    defaultValue: '',
  })
  generatorType: string;

  // 负责人
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  owner: string;

  // 代码质量
  @Column({
    type: DataType.STRING,
    field: 'code_quality',
    defaultValue: '',
  })
  codeQuality: string;

  // 级别名称
  @Column({
    type: DataType.STRING,
    field: 'level_name',
    defaultValue: '',
  })
  levelName: string;

  // 级别
  @Column({
    type: 'int',
    defaultValue: null,
  })
  level: number;

  // 创建用户
  @Column({
    type: DataType.STRING,

    field: 'create_user_name',
  })
  createUserName: string;

  // 创建日期
  @Column({
    type: 'datetime',
    field: 'create_date',
    defaultValue: () => 'NOW()',
  })
  createDate: Date;

  // 更新用户
  @Column({
    type: DataType.STRING,

    field: 'update_user_name',
    defaultValue: '',
  })
  updateUserName: string;

  // 更新日期
  @Column({
    type: 'datetime',
    field: 'update_date',
    defaultValue: null,
  })
  updateDate: Date;

  // 更新次数
  @Column({
    type: 'int',
    defaultValue: 0,
  })
  version: number;

  // 数据库IP
  @Column({
    type: DataType.STRING,
    field: 'database_ip',
    defaultValue: '',
  })
  databaseIp: string;

  // 数据库端口
  @Column({
    type: DataType.STRING,
    field: 'database_port',
    defaultValue: '',
  })
  databasePort: string;

  // 数据库名称
  @Column({
    type: DataType.STRING,
    field: 'database_name',
    defaultValue: '',
  })
  databaseName: string;

  // 数据库用户
  @Column({
    type: DataType.STRING,
    field: 'database_user_name',
    defaultValue: '',
  })
  databaseUserName: string;

  // 数据库密码
  @Column({
    type: DataType.STRING,
    field: 'database_user_password',
    defaultValue: '',
  })
  databaseUserPassword: string;

  // TOKEN
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  token: string;

  // 已分配用户
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  assigned: string;

  // 每日冻结时段
  @Column({
    type: DataType.STRING,
    field: 'freeze_hours',
    defaultValue: '',
  })
  freezeHours: string;

  // 开放微对象给项目
  @Column({
    type: DataType.STRING,
    field: 'can_access_micro_objects',
    defaultValue: '',
  })
  canAccessMicroObjects: string;

  // 开放微服务给项目
  @Column({
    type: DataType.STRING,
    field: 'can_access_micro_services',
    defaultValue: '',
  })
  canAccessMicroServices: string;

  // 开放微模块给项目
  @Column({
    type: DataType.STRING,
    field: 'can_access_micro_modules',
    defaultValue: '',
  })
  canAccessMicroModules: string;

  // 能访问微对象的项目
  @Column({
    type: DataType.STRING,
    field: 'open_micro_object_to_projects',
    defaultValue: '',
  })
  openMicroObjectToProjects: string;

  // 能访问微服务的项目
  @Column({
    type: DataType.STRING,
    field: 'open_micro_service_to_projects',
    defaultValue: '',
  })
  openMicroServiceToProjects: string;

  // 能访问微模块的项目
  @Column({
    type: DataType.STRING,
    field: 'open_micro_module_to_projects',
    defaultValue: '',
  })
  openMicroModuleToProjects: string;
}
