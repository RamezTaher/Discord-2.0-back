import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessagesService } from 'src/messages/messages';
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
    @Inject(Services.USERS) private readonly userService: IUsersService,
    @Inject(Services.MESSAGES)
    private readonly messageService: IMessagesService,
  ) {}
  async createChannel(user: User, params: CreateChannelParams) {
    if (user.id === params.receiverId) {
      throw new HttpException(
        'We Connot Create This Channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isConversationExists = await this.channelRepository.findOne({
      where: [
        {
          sender: { id: user.id },
          receiver: { id: params.receiverId },
        },
        {
          receiver: { id: user.id },
          sender: { id: params.receiverId },
        },
      ],
    });
    if (isConversationExists) {
      throw new HttpException(
        'This Channel Already Exists',
        HttpStatus.CONFLICT,
      );
    }
    const receiver = await this.userService.findUser({ id: params.receiverId });
    if (!receiver)
      throw new HttpException(
        'No User Founded With Such ID',
        HttpStatus.BAD_REQUEST,
      );

    const newChannel = this.channelRepository.create({
      sender: user,
      receiver,
    });

    return this.channelRepository.save(newChannel);
  }

  async getChannels(id: number) {
    const channels = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.lastMessageSent', 'lastMessageSent')
      .leftJoin('channel.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.firstName',
        'sender.lastName',
        'sender.email',
        'sender.userName',
      ])
      .leftJoin('channel.receiver', 'receiver')
      .addSelect([
        'receiver.id',
        'receiver.firstName',
        'receiver.lastName',
        'receiver.email',
        'receiver.userName',
      ])
      .where('sender.id=:id', { id })
      .orWhere('receiver.id=:id', { id })
      .orderBy('channel.lastMessageSentAt', 'DESC')
      .getMany();

    return channels;
  }

  async getChannelById(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne(id);

    return channel;
  }
}
