import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { ClubModule } from '../club/club.module';
import { MemberEntity } from '../member/member.entity';
import { MemberModule } from '../member/member.module';
import { ClubMemberService } from './club-member.service';
import { ClubMemberController } from './club-member.controller';

@Module({
  providers: [ClubMemberService],
  exports: [ClubMemberService],
  imports: [
    TypeOrmModule.forFeature([ClubEntity, MemberEntity]),
    ClubModule,
    MemberModule,
  ],
  controllers: [ClubMemberController],
})
export class ClubMemberModule {}
