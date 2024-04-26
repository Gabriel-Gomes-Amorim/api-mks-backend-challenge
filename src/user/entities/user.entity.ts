import BaseEntity from 'src/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;
}
