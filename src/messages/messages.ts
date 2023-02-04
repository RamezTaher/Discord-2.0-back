import { CreateMessageParams, CreateMessageResponse } from 'src/utils/@types';
import { Message } from '../utils/typeorm';

export interface IMessagesService {
  createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;
  getMessagesByChannelId(channelId: number): Promise<Message[]>;
}
