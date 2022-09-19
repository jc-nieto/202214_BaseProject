import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemberModule])],
  providers: [MemberService],
  exports: [MemberModule],
  controllers: [MemberController],
})
export class MemberModule {}
