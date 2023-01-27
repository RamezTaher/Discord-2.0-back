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
}
