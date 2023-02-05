import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guard';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { IMessagesService } from './messages';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(AuthenticatedGuard)
@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messagesService: IMessagesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() createMessagePayload: CreateMessageDto,
  ) {
    const msg = await this.messagesService.createMessage({
      ...createMessagePayload,
      user,
    });
    this.eventEmitter.emit('message.create', msg);
    return msg;
  }

  @Get(':id')
  async getMessagesByChannelId(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) channelId: number,
  ) {
    const messages = await this.messagesService.getMessagesByChannelId(
      channelId,
    );
    return { id: channelId, messages };
  }
}
