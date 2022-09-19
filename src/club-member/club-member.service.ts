import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { ClubService } from '../club/club.service';
import { MemberEntity } from '../member/member.entity';
import { MemberService } from '../member/member.service';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class ClubMemberService {
  constructor(
    @InjectRepository(ClubEntity)
    private clubRepository: Repository<ClubEntity>,
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    private clubService: ClubService,
    private memberService: MemberService,
  ) {}

  async addMemberToClub(clubId: string, memberId: string): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubService.findOne(clubId);
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const member: MemberEntity = await this.memberService.findOne(memberId);
    if (!member)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    club.members = [...club.members, member];
    return await this.clubRepository.save(club);
  }

  async findMembersFromClub(clubId: string): Promise<MemberEntity[]> {
    const club: ClubEntity = await this.clubService.findOne(clubId);
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return club.members;
  }

  async findMemberFromClub(
    clubId: string,
    memberId: string,
  ): Promise<MemberEntity> {
    const club: ClubEntity = await this.clubService.findOne(clubId);
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return this.findMemberInClub(memberId, club);
  }

  async updateMembersFromClub(
    clubId: string,
    members: MemberEntity[],
  ): Promise<ClubEntity> {
    let persistClub: ClubEntity = await this.clubService.findOne(clubId);
    if (!persistClub)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    persistClub.members = members;
    persistClub = await this.clubRepository.save(persistClub);
    return await this.clubService.findOne(clubId);
  }

  async deleteMemberFromClub(clubId: string, memberId: string) {
    const member: MemberEntity = await this.memberService.findOne(memberId);
    if (!member)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const club: ClubEntity = await this.clubService.findOne(clubId);
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const memberClub: MemberEntity = club.members.find(
      (me) => me.id === memberId,
    );
    if (!memberClub)
      throw new BusinessLogicException(
        'The member with the given id is not associated to the Club',
        BusinessError.PRECONDITION_FAILED,
      );
    club.members = club.members.filter((me) => me.id !== memberId);
    await this.clubRepository.save(club);
  }

  private findMemberInClub(memberId: string, club: ClubEntity): MemberEntity {
    const interestMember: MemberEntity = club.members.find(
      (me) => me.id === memberId,
    );
    if (!interestMember)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return interestMember;
  }
}
