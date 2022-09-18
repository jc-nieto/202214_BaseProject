import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';
import { faker } from '@faker-js/faker';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;
  let memberList: MemberEntity[];

  const generateMember = () => {
    const memberDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      email: faker.internet.exampleEmail(),
      birthDate: faker.lorem.sentence(),
      clubs: [],
    };
    return memberDict;
  };

  const seedDatabase = async () => {
    await repository.clear();
    memberList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await repository.save(generateMember());
      memberList.push(member);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new member', async () => {
    const member: MemberEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      email: faker.internet.exampleEmail(),
      birthDate: faker.lorem.sentence(),
      clubs: [],
    };

    const newMember: MemberEntity = await service.create(member);
    expect(newMember).not.toBeNull();
    const storedMember: MemberEntity = await service.findOne(newMember.id);
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(newMember.name);
    expect(storedMember.email).toEqual(newMember.email);
  });

  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(memberList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMember: MemberEntity = memberList[0];
    const member: MemberEntity = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.name).toEqual(storedMember.name);
    expect(member.email).toEqual(storedMember.email);
    expect(member.birthDate).toEqual(storedMember.birthDate);
  });

  it('update should modify a member', async () => {
    const member: MemberEntity = memberList[0];
    member.name = 'New name';
    const updatedMember: MemberEntity = await service.update(member.id, member);
    expect(updatedMember).not.toBeNull();
    const storedMember: MemberEntity = await repository.findOne({
      where: { id: member.id },
    });
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(member.name);
  });

  it('should delete an existing member', async () => {
    await service.delete(memberList[0].id);
    const members: MemberEntity[] = await service.findAll();
    expect(members.length).toEqual(4);
  });

  afterAll(() => {
    repository.clear();
  });
});
