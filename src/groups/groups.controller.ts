import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IGroupService } from './groups';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateGroupDto } from './dtos/CreateGroupDto';

@Controller(Routes.GROUPS)
export class GroupsController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupsService: IGroupService,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    this.groupsService.createGroup({ ...payload, creator: user });
  }
}
