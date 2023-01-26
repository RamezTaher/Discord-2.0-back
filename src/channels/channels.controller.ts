import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/Guard';
import { IUsersService } from 'src/users/users';
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
    @Inject(Services.USERS) private usersService: IUsersService,
  ) {}
  @Post()
  async createChannel(
    @AuthUser() user: User,
    @Body() createChannelPayload: CreateChannelDto,
  ) {
    const userQueriedBD = await this.usersService.findUser({ id: user.id });
    console.log(userQueriedBD);
    this.channelsService.createChannel(userQueriedBD, createChannelPayload);
  }
}
