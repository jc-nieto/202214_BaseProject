import { ClubEntity } from '../club/club.entity';
import { ClubService } from '../club/club.service';
import { MemberEntity } from '../member/member.entity';
import { MemberService } from '../member/member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubMemberService } from './club-member.service';

describe('ClubMemberService', () => {
  let clubMemberProvider: ClubMemberService;
  let clubProvider: ClubService;
  let memberProvider: MemberService;
  let clubRepository: Repository<ClubEntity>;
  let memberRepository: Repository<MemberEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubMemberService, ClubService, MemberService],
    }).compile();
    clubMemberProvider = module.get<ClubMemberService>(ClubMemberService);
    clubProvider = module.get<ClubService>(ClubService);
    memberProvider = module.get<MemberService>(MemberService);
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    memberRepository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity),
    );
  });

  it('should be defined', () => {
    expect(clubMemberProvider).toBeDefined();
  });
});
