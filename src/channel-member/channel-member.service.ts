import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateChannelMemeberParams,
  FindChannelMemberParams,
} from 'src/utils/@types';
import { ChannelMember } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IChannelMemberService } from './channel-member';

@Injectable()
export class ChannelMemberService implements IChannelMemberService {
  constructor(
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
  ) {}
  findChannelMemeber(
    params: FindChannelMemberParams,
  ): Promise<ChannelMember | null> {
    return this.channelMemberRepository.findOne({ id: params.id });
  }
  createChannelMemeber(
    params: CreateChannelMemeberParams,
  ): Promise<ChannelMember> {
    const newChannelMember = this.channelMemberRepository.create(params);
    return this.channelMemberRepository.save(newChannelMember);
  }

  findChannelMemebersChannels(id: number) {
    return this.channelMemberRepository
      .createQueryBuilder('channelMembers')
      .leftJoinAndSelect('channelMembers.channels', 'channel')
      .where('channelMembers.id = :id', { id })
      .leftJoinAndSelect('channel.channelMembers', 'channelMembers')
      .leftJoin('channelMembers.user', 'user')
      .addSelect([
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.userName',
        'user.id',
      ])
      .getRawOne();
  }
}
