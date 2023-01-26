import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindChannelMemberParams } from 'src/utils/@types';
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
    param: FindChannelMemberParams,
  ): Promise<ChannelMember | null> {
    return this.channelMemberRepository.findOne({ id: param.id });
  }
  createChannelMemeber(): Promise<ChannelMember> {
    throw new Error('f');
  }
}
