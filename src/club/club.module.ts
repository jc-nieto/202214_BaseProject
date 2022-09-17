import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [],
})
export class ClubModule {}
