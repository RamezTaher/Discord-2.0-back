import {
  Body,
  Controller,
  Delete,
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
    @Param('id', ParseIntPipe) channelId: number,
    @Body()
    { messageContent }: CreateMessageDto,
  ) {
    const params = { user, channelId, messageContent };
    const msg = await this.messagesService.createMessage(params);

    this.eventEmitter.emit('message.create', msg);
    return;
  }

  @Get()
  async getMessagesByChannelId(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) channelId: number,
  ) {
    const messages = await this.messagesService.getMessagesByChannelId(
      channelId,
    );
    return { id: channelId, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromChannel(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) channelId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    await this.messagesService.deleteMessage({
      userId: user.id,
      channelId,
      messageId,
    });
  }
}
