import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../utils/typeorm';
import { IGroupMessageService } from './group-messages';
import { CreateGroupMessageParams } from 'src/utils/@types';

@Injectable()
export class GroupMessagesService implements IGroupMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  createGroupMessage(params: CreateGroupMessageParams) {
    this.messageRepository.create();
  }
}
