import { ClubEntity } from 'src/club/club.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  birthDate: string;

  @ManyToMany(() => ClubEntity, (club) => club.members)
  clubs: ClubEntity[];
}