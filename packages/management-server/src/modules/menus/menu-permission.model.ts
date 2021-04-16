/**
 * 菜单表
 */
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { MenusModel } from './menus.model';

@Table({
  timestamps: false,
  tableName: 'menu_permission',
})

export class MenuPermissionModel extends BaseModel {
  @Column({
    type: DataType.BIGINT,
  })
  roleId: number;

  // 菜单ID
  @ForeignKey(() => MenusModel)
  @Column({
    type: DataType.BIGINT,
  })
  menuId: number;

  // 菜单权限
  @Column({
    type: DataType.TINYINT,
    defaultValue: 1,
    comment: '0:无权限，1:只读，2:可读写',
  })
  authorization: number;

  // 描述
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  description: string;

  @BelongsTo(() => MenusModel, 'menuId')
  menu: MenusModel;
}
