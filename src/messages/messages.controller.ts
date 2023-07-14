import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateMessageDto } from './dtos/UpdateMessageDto';

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
    this.eventEmitter.emit('message.delete', {
      userId: user.id,
      messageId,
      channelId,
    });
    return { channelId, messageId };
  }

  @Patch(':messageId')
  async updateMessage(
    @AuthUser() { id: userId }: User,
    @Param('id') channelId: number,
    @Param('messageId') messageId: number,
    @Body() { messageContent }: UpdateMessageDto,
  ) {
    const params = { userId, messageContent, channelId, messageId };
    const message = await this.messagesService.updateMessage(params);
    this.eventEmitter.emit('message.update', message);
    return message;
  }
}
