import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/utils/typeorm';
import { GroupMessagesController } from './group-messages.controller';
import { Services } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [GroupMessagesController],
  providers: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
})
export class GroupMessagesModule {}
