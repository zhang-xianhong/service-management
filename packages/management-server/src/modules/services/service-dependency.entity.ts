import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'service_api' })
export class ServicesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'service_id' })
  serviceId: number;

  @Column({ type: 'bigint', name: 'dependency_id' })
  dependencyId: number;

  @Column({ length: 255 })
  remark: string;

  @Column()
  version: number;
}
