import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberModule])],
  providers: [MemberService],
  exports: [MemberModule],
})
export class MemberModule {}
