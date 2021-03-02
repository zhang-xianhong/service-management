import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'service_api' })
export class ServicesApiEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  url: string;

  @Column({ default: 'GET' })
  method: 'GET' | 'POST' | 'PUT';

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'bigint', name: 'service_id' })
  serviceId: number;

  @Column()
  version: number;
}
