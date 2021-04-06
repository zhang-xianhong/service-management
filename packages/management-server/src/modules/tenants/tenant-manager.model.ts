/**
 * 项目管理员
 */
import { Table, Column, DataType, Length, ForeignKey } from 'sequelize-typescript';
import { genPassword } from 'src/shared/utils/password';
import { BaseModel } from '../base.entity';
import { TenantInfoModel } from './tenant-info.model';

@Table({
  timestamps: false,
  tableName: 'tenant_manager',
})
export class TenantManagerModel extends BaseModel {
  // 所属租户
  @ForeignKey(() => TenantInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'tenant_id',
  })
  tenantId: number;

  // 管理员账号
  @Length({ min: 2, max: 40 })
  @Column({
    type: DataType.STRING,
    defaultValue: '',
    unique: true,
  })
  account: string;

  // 管理员名称
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 管理员电话
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  phone: string;

  // 管理员密码
  @Column({
    type: DataType.STRING,
    defaultValue: '',
    set(val: string) {
      const { hash } = genPassword(val);
      this.setDataValue('password', hash);
    },
  })
  password: string;
}
