import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  username: string;

  @Column('varchar')
  salt: string;

  @Column('varchar')
  hash: string;

  @Column({ length: 100, default: '' })
  email: string;

  @Column({ length: 20, default: '' })
  mobile: string;
}
