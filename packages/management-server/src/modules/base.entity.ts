import { Sequelize, NOW } from 'sequelize';

import { Table, Column, DataType, PrimaryKey, AutoIncrement, Default, Model } from 'sequelize-typescript';
@Table({
  timestamps: false,
})
export class BaseModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  // 创建时间
  @Default(NOW)
  @Column({
    field: 'create_time',
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  createTime: Date;

  // 修改时间
  @Column({
    field: 'update_time',
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  updateTime: Date;

  // 创建人
  @Column({
    type: DataType.BIGINT,
    field: 'create_user',
  })
  createUser: number;

  // 更新人
  @Column({
    type: DataType.BIGINT,
    field: 'update_user',
  })
  updateUser: number;

  // 是否删除
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_delete',
    defaultValue: false,
  })
  isDelete: boolean;
}

