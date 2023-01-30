import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateMessageParams } from 'src/utils/@types';
import { Channel, Message, User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async createMessage(params: CreateMessageParams): Promise<Message> {
    const channel = await this.channelRepository.findOne({
      where: { id: params.channelId },
      relations: ['sender', 'receiver'],
    });
    if (!channel)
      throw new HttpException(
        'This Channel Does Not Exist',
        HttpStatus.BAD_REQUEST,
      );
    if (
      channel.sender.id !== params.user.id &&
      channel.receiver.id !== params.user.id
    )
      throw new HttpException('Users Do Not Match', HttpStatus.FORBIDDEN);
    channel.sender = instanceToPlain(channel.sender) as User;
    channel.receiver = instanceToPlain(channel.receiver) as User;
    const newMessage = this.messageRepository.create({
      messageContent: params.messageContent,
      channel,
      sender: instanceToPlain(params.user),
    });
    return this.messageRepository.save(newMessage);
  }
}
