import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IChannelMemberService } from 'src/channel-member/channel-member';
import { CreateChannelParams } from 'src/utils/@types';
import { Services } from 'src/utils/constants';
import { Channel, User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IChannelsService } from './channels';

@Injectable()
export class ChannelsService implements IChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @Inject(Services.CHANNELMEMBER)
    private readonly channelMemberService: IChannelMemberService,
  ) {}
  async createChannel(userDB: User, params: CreateChannelParams) {
    if (!userDB.channelMember) {
      const newChannelMember = this.channelMemberService.createChannelMemeber({
        id: params.senderId,
      });
    }
    const receiver = await this.channelMemberService.findChannelMemeber({
      id: params.receiverId,
    });
  }
}
