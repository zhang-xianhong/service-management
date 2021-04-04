/**
 * 租户联系人
 */
import { Table, Column, DataType, Length, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { TenantInfoModel } from './tenant-info.model';

@Table({
  timestamps: false,
  tableName: 'tenant_contact',
})
export class TenantContactModel extends BaseModel {
  // 所属租户
  @ForeignKey(() => TenantInfoModel)
  @Column({
    type: DataType.BIGINT,
    field: 'tenant_id',
  })
  tenantId: number;

  // 联系人名称
  @Length({ min: 2, max: 40 })
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 联系人电话
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  phone: string;

  // 联系人身份证号
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  IDCard: string;

  // 联系人邮箱
  @Column({
    type: DataType.STRING,
    field: 'email',
    defaultValue: '',
  })
  email: string;

  // 身份证正面照url
  @Column({
    type: DataType.STRING,
    field: 'front_photo',
    defaultValue: null,
  })
  frontPhoto: string;

  // 身份证反面照url
  @Column({
    type: DataType.STRING,
    field: 'reverse_photo',
    defaultValue: '',
  })
  reversePhoto: string;
}
