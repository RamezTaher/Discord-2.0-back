import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guard';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { IMessagesService } from './messages';

@UseGuards(AuthenticatedGuard)
@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messagesService: IMessagesService,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Body() createMessagePayload: CreateMessageDto,
  ) {
    return await this.messagesService.createMessage({
      user,
      ...createMessagePayload,
    });
  }

  @Get(':id')
  async getMessagesByChannelId(
    @AuthUser() user: User,
    @Param('id') channelId: number,
  ) {
    return await this.messagesService.getMessagesByChannelId(channelId);
  }
}
