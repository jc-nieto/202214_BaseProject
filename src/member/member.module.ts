import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberModule])],
  providers: [MemberService],
})
export class MemberModule {}
