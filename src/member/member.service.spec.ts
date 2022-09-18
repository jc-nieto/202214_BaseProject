import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
