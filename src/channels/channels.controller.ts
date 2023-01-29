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
import { CreateChannelDto } from './dtos/CreateChannel';

@Controller(Routes.CHANNELS)
@UseGuards(AuthenticatedGuard)
export class ChannelsController {
  constructor(
    @Inject(Services.CHANNELS) private channelsService: IChannelsService,
  ) {}
  // Create the Channel
  @Post()
  async createChannel(
    @AuthUser() user: User,
    @Body() createChannelPayload: CreateChannelDto,
  ) {
    return this.channelsService.createChannel(user, createChannelPayload);
  }

  // Get The Channel
  @Get()
  async getChannel(@AuthUser() user: User) {
    const channel = await this.channelsService.getChannels(user.id);

    return channel;
  }

  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    const channel = await this.channelsService.getChannelById(id);
    return channel;
  }
}
