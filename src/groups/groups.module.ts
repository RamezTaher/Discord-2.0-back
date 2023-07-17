import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { Services } from 'src/utils/constants';
import { GroupsService } from './groups.service';

@Module({
  imports: [],
  controllers: [GroupsController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule {}
