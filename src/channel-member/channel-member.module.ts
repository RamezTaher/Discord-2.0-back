import { Module } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';

import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from 'src/utils/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember])],
  controllers: [],
  providers: [
    {
      provide: Services.CHANNELMEMBER,
      useClass: ChannelMemberService,
    },
  ],
  exports: [
    {
      provide: Services.CHANNELMEMBER,
      useClass: ChannelMemberService,
    },
  ],
})
export class ChannelMemberModule {}
