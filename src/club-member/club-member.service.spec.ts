import { ClubEntity } from '../club/club.entity';
import { ClubService } from '../club/club.service';
import { MemberEntity } from '../member/member.entity';
import { MemberService } from '../member/member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubMemberService } from './club-member.service';
import { faker } from '@faker-js/faker';

describe('ClubMemberService', () => {
  let clubMemberProvider: ClubMemberService;
  let clubProvider: ClubService;
  let memberProvider: MemberService;
  let clubRepository: Repository<ClubEntity>;
  let memberRepository: Repository<MemberEntity>;
  let clubList: ClubEntity[];
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

  const generateClub = () => {
    const clubDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      fundationDate: faker.lorem.sentence(),
      url_image: faker.internet.url(),
      description: faker.datatype.string(80),
      members: [],
    };
    return clubDict;
  };

  const seedDatabase = async () => {
    await clubRepository.clear();
    await memberRepository.clear();
    clubList = [];
    memberList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await memberRepository.save(
        Object.assign(new MemberEntity(), generateMember()),
      );
      const club: ClubEntity = await clubRepository.save(
        Object.assign(new ClubEntity(), generateClub()),
      );
      memberList.push(member);
      clubList.push(club);
    }
    memberList[0].clubs = [clubList[0]];
    memberList[1].clubs = [clubList[0]];
    memberList.map(async (me) => await memberRepository.save(me));
    for (let i = 0; i < memberList.length; i++) {
      memberList[i] = await memberProvider.findOne(memberList[i].id);
    }
    for (let i = 0; i < clubList.length; i++) {
      clubList[i] = await clubProvider.findOne(clubList[i].id);
    }
    clubList[0].members = [memberList[0], memberList[1]];
    clubList.map(async (cl) => await clubRepository.save(cl));
    for (let i = 0; i < clubList.length; i++) {
      clubList[i] = await clubProvider.findOne(clubList[i].id);
    }
  };

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
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(clubMemberProvider).toBeDefined();
  });

  it('should add member to club', async () => {
    const memberId = memberList[3].id;
    const clubId = clubList[1].id;
    await clubMemberProvider.addMemberToClub(clubId, memberId);
    const modifiedClub: ClubEntity = await clubProvider.findOne(clubId);
    expect(modifiedClub.members.find((me) => me.id === memberId).id).toEqual(
      memberId,
    );
  });

  it('should find all members in club', async () => {
    const clubId = clubList[0].id;
    const members: MemberEntity[] =
      await clubMemberProvider.findMembersFromClub(clubId);
    expect(members.length).toEqual(2);
  });

  it('should find member in club', async () => {
    const memberId = memberList[0].id;
    const clubId = clubList[0].id;
    const member: MemberEntity = await clubMemberProvider.findMemberFromClub(
      clubId,
      memberId,
    );
    expect(member).toBeDefined();
  });

  it('should update members in club', async () => {
    const clubId = clubList[0].id;
    const members: MemberEntity[] = memberList;
    await clubMemberProvider.updateMembersFromClub(clubId, members);
    const modifiedClub: ClubEntity = await clubProvider.findOne(clubId);
    expect(modifiedClub.members.length).toEqual(memberList.length);
  });

  it('should delete member from club', async () => {
    const clubId = clubList[0].id;
    const memberId = memberList[0].id;
    await clubMemberProvider.deleteMemberFromClub(clubId, memberId);
    const club: ClubEntity = await clubProvider.findOne(clubId);
    expect(club.members.length).toEqual(1);
  });
});
