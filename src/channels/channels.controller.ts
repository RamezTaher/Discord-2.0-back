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
import { IChannelsService } from './channels';
import { CreateChannelDto } from './dtos/CreateChannelDto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToPlain } from 'class-transformer';

@Controller(Routes.CHANNELS)
@UseGuards(AuthenticatedGuard)
export class ChannelsController {
  constructor(
    @Inject(Services.CHANNELS) private channelsService: IChannelsService,
    private readonly events: EventEmitter2,
  ) {}
  // Create the Channel
  @Post()
  async createChannel(
    @AuthUser() user: User,
    @Body() createChannelPayload: CreateChannelDto,
  ) {
    const channel = await this.channelsService.createChannel(
      user,
      createChannelPayload,
    );
    this.events.emit('conversation.create', channel);
    return instanceToPlain(channel);
  }

  // Get Channels
  @Get()
  async getChannel(@AuthUser() user: User) {
    const channel = await this.channelsService.getChannels(user.id);

    return channel;
  }

  // Get Channel
  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    const channel = await this.channelsService.getChannelById(id);
    return channel;
  }
}
