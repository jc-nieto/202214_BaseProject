import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

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
    await repository.clear();
    clubList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save(generateClub());
      clubList.push(club);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      fundationDate: faker.lorem.sentence(),
      url_image: faker.internet.url(),
      description: faker.datatype.string(80),
      members: [],
    };

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();
    const storedClub: ClubEntity = await service.findOne(newClub.id);
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name);
    expect(storedClub.description).toEqual(newClub.description);
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
    expect(club.description).toEqual(storedClub.description);
    expect(club.fundationDate).toEqual(storedClub.fundationDate);
    expect(club.url_image).toEqual(storedClub.url_image);
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.name = 'New name';
    club.description = 'New description';
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: ClubEntity = await repository.findOne({
      where: { id: club.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name);
    expect(storedClub.description).toEqual(club.description);
  });

  it('should delete an existing club', async () => {
    await service.delete(clubList[0].id);
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs.length).toEqual(4);
  });

  afterAll(() => {
    repository.clear();
  });
});
