import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { Channel } from 'src/utils/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), UsersModule],
  controllers: [ChannelsController],
  providers: [
    {
      provide: Services.CHANNELS,
      useClass: ChannelsService,
    },
  ],
})
export class ChannelsModule {}
