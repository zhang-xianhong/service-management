/**
 * 项目实体
 */
import { Table, Column, DataType, Length  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'file',
})
export class FilesModel extends BaseModel {
  // 文件id
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  fileId: string;

  // 文件地址
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  path: string;

  // 文件名称
  @Length({ min: 1, max: 64 })
  @Column({
    type: DataType.STRING,

    defaultValue: '',
  })
  name: string;

  // 文件大小
  @Column({
    type: DataType.INTEGER,
    defaultValue: null,
  })
  size: number;

  // 描述描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  // 文件类型
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  fileType: string;
}

