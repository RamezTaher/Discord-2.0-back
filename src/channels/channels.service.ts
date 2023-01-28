import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
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
    const isChannelExisting = await this.getChannelByChannelMembers([
      params.senderId,
      params.receiverId,
    ]);

    console.log('conversation exists', isChannelExisting);
    if (isChannelExisting) {
      throw new HttpException('Channel Exists', HttpStatus.CONFLICT);
    }
    // Get Sender and receiver from DB
    const sender = await this.userService.findUser({ id: user.id });
    const receiver = await this.userService.findUser({ id: params.receiverId });
    console.log(sender, receiver);

    if (!sender.channelMember) {
      const channelMember = await this.createChannelMemberAndSaveUser(
        sender,
        params.senderId,
      );
      channelMembers.push(channelMember);
    } else {
      channelMembers.push(sender.channelMember);
    }

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

  async createChannelMemberAndSaveUser(user: User, id: number) {
    const channelMember = await this.channelMemberService.createChannelMemeber({
      id,
    });
    user.channelMember = channelMember;
    await this.userService.saveUser(user);
    return channelMember;
  }

  async getChannel(id: number) {
    const channels = await this.channelRepository
      .createQueryBuilder('channels')
      .leftJoinAndSelect('channels.channelMembers', 'channelMembers')
      .where('channelMembers.id IN (:...channelMembers)', {
        channelMembers: [id],
      })
      .getMany();
    const promises = channels.map((channel) => {
      return this.channelRepository
        .findOne(channel.id, {
          relations: ['channelMembers', 'channelMembers.user'],
        })
        .then((channelQuired) => {
          console.log(channelQuired);
          const sender = channelQuired.channelMembers.find(
            (channelMember) => channelMember.id === id,
          );
          const receiver = channelQuired.channelMembers.find(
            (channelMember) => channelMember.id !== id,
          );
          sender.user = instanceToPlain(sender.user) as User;
          receiver.user = instanceToPlain(receiver.user) as User;
          return { ...channelQuired, receiver };
        });
    });
    return Promise.all(promises);
  }

  async getChannelByChannelMembers(channelMembers: number[]): Promise<Channel> {
    return this.channelRepository
      .createQueryBuilder('channels')
      .leftJoinAndSelect('channels.channelMembers', 'channelMembers')
      .where('channelMembers.id IN (:...channelMembers)', { channelMembers })
      .getOne();
  }

  async getChannelById(id: number): Promise<Channel> {
    return this.channelRepository.findOne(id, {
      relations: ['channelMembers', 'channelMembers.user'],
    });
  }
}
