import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { ClubModule } from '../club/club.module';
import { MemberEntity } from '../member/member.entity';
import { MemberModule } from '../member/member.module';
import { ClubMemberService } from './club-member.service';

@Module({
  providers: [ClubMemberService],
  imports: [
    TypeOrmModule.forFeature([ClubEntity, MemberEntity]),
    ClubModule,
    MemberModule,
  ],
})
export class ClubMemberModule {}
