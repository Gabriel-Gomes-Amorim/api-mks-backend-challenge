import { Column, Entity } from 'typeorm';
import BaseEntity from '../../database/entities/base.entity';

@Entity('movie')
export class Movie extends BaseEntity {
  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'director', nullable: false })
  director: string;

  @Column({ name: 'gender', nullable: false })
  gender: string;

  @Column({ name: 'release_year', nullable: false })
  releaseYear: number;

  @Column({ name: 'synopsis', nullable: false })
  synopsis: string;
}
