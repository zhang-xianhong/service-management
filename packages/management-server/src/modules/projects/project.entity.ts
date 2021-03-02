/**
 * 项目实体
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project' })
export class projectEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  // 项目名称
  @Column({
    type: 'varchar',
    length: 64,
  })
  name: string;

  // 描述
  @Column({
    type: 'varchar',
    length: 64,
  })
  description: string;

  // 状态
  @Column('int')
  status: string;

  // 是否只读
  @Column('boolean')
  readOnly: boolean;

  // 代码生成器类型
  @Column({
    type: 'tinytext',
    nullable: true,
  })
  generatorType: string;

  // 负责人
  @Column({
    type: 'varchar',
    nullable: true,
  })
  principal: string;

  // 代码质量
  @Column({
    type: 'varchar',
    nullable: true,
  })
  sonarQubeAddress: string;

  // 级别名称
  @Column({
    type: 'varchar',
    nullable: true,
  })
  levelName: string;

  // 级别
  @Column({
    type: 'tinytext',
    nullable: true,
  })
  levelNum: string;

  // 创建账号
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  createUser: string;

  // 创建用户
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  createUserName: string;

  // 创建日期
  @Column({
    type: 'datetime',
    nullable: true,
  })
  createsDate: Date;

  // 更新账号
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  updateUser: string;

  // 更新用户
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  updateUserName: string;

  // 更新日期
  @Column({
    type: 'datetime',
    nullable: true,
  })
  updateDate: Date;

  // 更新次数
  @Column({
    type: 'int',
    nullable: true,
  })
  version: number;

  // 数据库IP
  @Column({
    type: 'varchar',
    nullable: true,
  })
  databaseIp: string;

  // 数据库端口
  @Column({
    type: 'varchar',
    nullable: true,
  })
  databasePort: string;

  // 数据库名称
  @Column({
    type: 'varchar',
    nullable: true,
  })
  databaseName: string;

  // 数据库用户
  @Column({
    type: 'varchar',
    nullable: true,
  })
  databaseUserName: string;

  // 数据库密码
  @Column({
    type: 'varchar',
    nullable: true,
  })
  databaseUserPassword: string;

  // TOKEN
  @Column({
    type: 'varchar',
    nullable: true,
  })
  token: string;

  // 已分配用户
  @Column({
    type: 'varchar',
    nullable: true,
  })
  assigned: string;

  // 每日冻结时段
  @Column({
    type: 'varchar',
    nullable: true,
  })
  freezeHours: string;

  // 开放微对象给项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  canAccessMicroObjects: string;

  // 开放微服务给项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  canAccessMicroServices: string;

  // 开放微模块给项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  canAccessMicroModules: string;

  // 能访问微对象的项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  openMicroObjectToProjects: string;

  // 能访问微服务的项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  openMicroServiceToProjects: string;

  // 能访问微模块的项目
  @Column({
    type: 'varchar',
    nullable: true,
  })
  openMicroModuleToProjects: string;

  // 删除
  @Column({
    type: 'int',
    default: 0,
  })
  isDelete: number;
}
