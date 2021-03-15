import { NOW } from 'sequelize';
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
    type: DataType.DATE,
    field: 'create_time',
    defaultValue: NOW,
  })
  createTime: Date;

  // 修改时间
  @Column({
    type: DataType.DATE,
    field: 'update_time',
    defaultValue: NOW,
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

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_delete',
    defaultValue: false,
  })
  isDelete: boolean;
}

