import { Message } from '../utils/typeorm';
import { CreateMessageParams } from '../utils/types';

export interface IMessagesService {
  createMessage(params: CreateMessageParams): Promise<Message>;
}
