import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guard';
import { Routes, Services } from 'src/utils/constants';
import { IChannelsService } from './channels';
import { CreateChannelDto } from './dtos/CreateChannel';

@Controller(Routes.CHANNELS)
@UseGuards(AuthenticatedGuard)
export class ChannelsController {
  constructor(
    @Inject(Services.CHANNELS) private channelsService: IChannelsService,
  ) {}
  @Post()
  createChannel(@Body() createChannelPayload: CreateChannelDto) {
    this.channelsService.createChannel(createChannelPayload);
  }
}
