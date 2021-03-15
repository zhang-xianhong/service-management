

import { Table, Column, DataType, Length  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'user',
})
export class User extends BaseModel<User>  {
  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({
    type: DataType.STRING,
  })
  salt: string;

  @Column({
    type: DataType.STRING,
  })
  hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Length({
    min: 6,
    max: 11,
    msg: 'The length of post title can\'t be shorter than 3 and longer than 60 ',
  })
  @Column({
    type: DataType.STRING,
  })
  mobile: string;
}
