import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IChannelMemberService } from 'src/channel-member/channel-member';
import { IUsersService } from 'src/users/users';
import { CreateChannelParams } from 'src/utils/@types';
import { Services } from 'src/utils/constants';
import { Channel, ChannelMember, User } from 'src/utils/typeorm';
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
    const channelMembers: ChannelMember[] = [];
    const sender = await this.userService.findUser({ id: user.id });
    if (!sender.channelMember) {
      const channelMember = await this.createChannelMemberAndSaveUser(
        sender,
        params.senderId,
      );
      channelMembers.push(channelMember);
    } else {
      channelMembers.push(sender.channelMember);
    }

    const receiver = await this.userService.findUser({ id: params.receiverId });
    if (!receiver || receiver.id === sender.id) {
      throw new HttpException(
        'Impossible To Start A Channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!receiver.channelMember) {
      const channelMember = await this.createChannelMemberAndSaveUser(
        receiver,
        params.receiverId,
      );

      channelMembers.push(channelMember);
    } else {
      channelMembers.push(receiver.channelMember);
    }

    const newChannel = this.channelRepository.create({ channelMembers });

    return this.channelRepository.save(newChannel);
  }

  public async createChannelMemberAndSaveUser(user: User, id: number) {
    const channelMember = await this.channelMemberService.createChannelMemeber({
      id,
    });
    user.channelMember = channelMember;
    await this.userService.saveUser(user);
    return channelMember;
  }
}
