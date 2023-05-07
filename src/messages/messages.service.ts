import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateMessageParams, CreateMessageResponse } from 'src/utils/@types';
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

  async createMessage({
    user,
    messageContent,
    channelId,
  }: CreateMessageParams): Promise<CreateMessageResponse> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['sender', 'receiver', 'lastMessageSent'],
    });
    if (!channel)
      throw new HttpException(
        'This Channel Does Not Exist',
        HttpStatus.BAD_REQUEST,
      );
    if (channel.sender.id !== user.id && channel.receiver.id !== user.id)
      throw new HttpException('Users Do Not Match', HttpStatus.FORBIDDEN);

    const newMessage = this.messageRepository.create({
      messageContent,
      channel,
      sender: instanceToPlain(user),
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    channel.lastMessageSent = savedMessage;
    const updatedChannel = await this.channelRepository.save(channel);
    return { message: savedMessage, channel: updatedChannel };
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
