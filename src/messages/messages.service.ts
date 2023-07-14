import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import {
  CreateMessageParams,
  CreateMessageResponse,
  DeleteMessageParams,
  UpdateMessageParams,
} from 'src/utils/@types';
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

  async deleteMessage(params: DeleteMessageParams) {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .where('id = :channelId', { channelId: params.channelId })
      .leftJoinAndSelect('channel.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('channel.messages', 'message')
      .where('channel.id = :channelId', {
        channelId: params.channelId,
      })
      .orderBy('message.sentAt', 'DESC')
      .limit(5)
      .getOne();

    if (!channel)
      throw new HttpException('channel not found', HttpStatus.BAD_REQUEST);

    const message = await this.messageRepository.findOne({
      id: params.messageId,
      sender: { id: params.userId },
      channel: { id: params.channelId },
    });
    if (!message)
      throw new HttpException('Cannot delete message', HttpStatus.BAD_REQUEST);
    if (channel.lastMessageSent.id !== message.id)
      return this.messageRepository.delete({ id: message.id });

    // Deleting Last Message
    const size = channel.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.channelRepository.update(
        { id: params.channelId },
        { lastMessageSent: null },
      );
      return this.messageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = channel.messages[SECOND_MESSAGE_INDEX];
      console.log('new LAst MEsage', newLastMessage);
      await this.channelRepository.update(
        { id: params.channelId },
        { lastMessageSent: newLastMessage },
      );
      return this.messageRepository.delete({ id: message.id });
    }
  }

  async updateMessage(params: UpdateMessageParams) {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        sender: { id: params.userId },
      },
      relations: ['channel', 'channel.sender', 'channel.receiver', 'sender'],
    });

    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.messageContent = params.messageContent;
    return this.messageRepository.save(messageDB);
  }
}
