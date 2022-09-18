import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from 'src/club/club.entity';
import { ClubModule } from 'src/club/club.module';
import { MemberEntity } from 'src/member/member.entity';
import { MemberModule } from 'src/member/member.module';
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
