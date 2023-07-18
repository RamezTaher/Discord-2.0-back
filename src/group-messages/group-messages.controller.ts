import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { IGroupMessageService } from './group-messages';
import { CreateMessageDto } from 'src/messages/dtos/CreateMessageDto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessagesController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessagesService: IGroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroupMessage(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { messageContent }: CreateMessageDto,
  ) {
    console.log(`Creating Group Message for ${id}`);
    const res = await this.groupMessagesService.createGroupMessage({
      sender: user,
      groupId: id,
      messageContent,
    });

    this.eventEmitter.emit('group.message.create', res);
    return;
  }
}
