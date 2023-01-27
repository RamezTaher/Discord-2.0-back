import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IChannelMemberService } from 'src/channel-member/channel-member';
import { IUsersService } from 'src/users/users';
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
    @Inject(Services.USERS) private readonly userService: IUsersService,
  ) {}
  async createChannel(user: User, params: CreateChannelParams) {
    const sender = await this.userService.findUser({ id: user.id });

    if (!sender.channelMember) {
      const newChannelMember =
        await this.channelMemberService.createChannelMemeber({
          id: params.senderId,
        });
      sender.channelMember = newChannelMember;
      await this.userService.saveUser(sender);
    }
    const receiver = await this.userService.findUser({ id: params.receiverId });

    console.log(receiver);

    if (!receiver || receiver.id === sender.id) {
      throw new HttpException(
        'Impossible To Start A Channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!receiver.channelMember) {
      const newChannelMember =
        await this.channelMemberService.createChannelMemeber({
          id: params.receiverId,
        });
      receiver.channelMember = newChannelMember;
      await this.userService.saveUser(receiver);
    }
  }
}
