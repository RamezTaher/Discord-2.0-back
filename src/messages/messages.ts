import { CreateMessageParams } from 'src/utils/@types';
import { Message } from '../utils/typeorm';

export interface IMessagesService {
  createMessage(params: CreateMessageParams): Promise<Message>;
  getMessagesByChannelId(channelId: number): Promise<Message[]>;
}
