/**
 * 菜单表
 */
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany  } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';

@Table({
  timestamps: false,
  tableName: 'settings_menu',
})

export class MenusModel extends BaseModel {
  // 名称
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  @ForeignKey(() => MenusModel)
  @Column({
    type: DataType.BIGINT,
    field: 'parent_id',
  })
  parentId: number;

  @BelongsTo(() => MenusModel)
  parent: MenusModel;

  @HasMany(() => MenusModel)
  children: MenusModel[];
}

