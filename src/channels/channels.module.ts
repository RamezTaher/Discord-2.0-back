import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { Channel, ChannelMember } from 'src/utils/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMember]),
    ChannelMemberModule,
    UsersModule,
  ],
  controllers: [ChannelsController],
  providers: [
    {
      provide: Services.CHANNELS,
      useClass: ChannelsService,
    },
  ],
})
export class ChannelsModule {}
