import { MemberEntity } from '../member/member.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  fundationDate: string;
  @Column()
  url_image: string;
  @Column()
  description: string;

  @ManyToMany(() => MemberEntity, (member) => member.clubs)
  @JoinTable()
  members: MemberEntity[];
}
