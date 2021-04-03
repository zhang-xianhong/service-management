import { Sequelize, NOW } from 'sequelize';

import { Table, Column, DataType, PrimaryKey, AutoIncrement, Default, Model } from 'sequelize-typescript';
@Table({
  timestamps: false,
  underscored: true,
})
export class BaseModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  // 创建时间
  @Default(NOW)
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  createTime: Date;

  // 修改时间
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updateTime: Date;

  // 创建人
  @Column({
    type: DataType.BIGINT,
  })
  createUser: number;

  // 更新人
  @Column({
    type: DataType.BIGINT,
  })
  updateUser: number;

  // 是否删除
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDelete: boolean;

  // 版本号;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  version: number;
}

