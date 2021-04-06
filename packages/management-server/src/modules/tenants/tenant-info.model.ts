/**
 * 租户实体
 */
import { Table, Column, DataType, Length, HasOne } from 'sequelize-typescript';
import { BaseModel } from '../base.entity';
import { TenantContactModel } from './tenant-contact.model';
import { TenantManagerModel } from './tenant-manager.model';

@Table({
  timestamps: false,
  tableName: 'tenant_info',
})
export class TenantInfoModel extends BaseModel {
  // 企业名称
  @Length({ max: 40 })
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  name: string;

  // 企业简称
  @Length({ max: 40 })
  @Column({
    type: DataType.STRING,
    field: 'name_short',
    defaultValue: '',
  })
  nameShort: string;

  // 所属行业
  @Column({
    type: DataType.STRING,
    field: 'industry_id',
    defaultValue: '',
  })
  industryId: string;

  // 企业性质
  @Column({
    type: DataType.STRING,
    field: 'nature_id',
    defaultValue: '',
  })
  natureId: string;

  // 企业规模
  @Column({
    type: DataType.STRING,
    field: 'scale_id',
    defaultValue: '',
  })
  scaleId: string;

  // 营业执照号
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  license: string;

  // 企业地址
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  addr: string;

  // 企业详细地址
  @Column({
    type: DataType.STRING,
    field: 'addr_detail',
    defaultValue: '',
  })
  addrDetail: string;

  // 企业简介
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  intro: string;

  // 营业执照URL
  @Column({
    type: DataType.STRING,
    field: 'license_url',
    defaultValue: '',
  })
  licenseUrl: string;

  // 企业LOGO
  @Column({
    type: DataType.STRING,
    field: 'logo_url',
    defaultValue: '',
  })
  logoUrl: string;

  // 租户状态
  @Column({
    type: DataType.TINYINT,
    defaultValue: 0,
    comment: '租户状态：0:正常，1:禁用',
  })
  status: number;

  @HasOne(() => TenantContactModel)
  contact: TenantContactModel;

  @HasOne(() => TenantManagerModel)
  manager: TenantManagerModel;
}
