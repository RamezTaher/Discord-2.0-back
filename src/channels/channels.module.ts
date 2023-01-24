import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  controllers: [ChannelsController],
  providers: [
    {
      provide: Services.CHANNELS,
      useClass: ChannelsService,
    },
  ],
})
export class ChannelsModule {}
