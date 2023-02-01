import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateMessageParams } from 'src/utils/@types';
import { Channel, Message } from 'src/utils/typeorm';
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
    const newMessage = this.messageRepository.create({
      messageContent: params.messageContent,
      channel,
      sender: instanceToPlain(params.user),
    });
    const savedMessage = await this.messageRepository.save(newMessage);
    channel.lastMessageSent = savedMessage;
    await this.channelRepository.save(channel);
    return savedMessage;
  }

  async getMessagesByChannelId(channelId: number): Promise<Message[]> {
    const messages = await this.messageRepository.find({
      relations: ['sender'],
      where: { channel: { id: channelId } },
      order: { sentAt: 'DESC' },
    });

    return messages;
  }
}
