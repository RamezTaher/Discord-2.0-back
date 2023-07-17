import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IGroupService } from './groups';

@Controller(Routes.GROUPS)
export class GroupsController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupsService: IGroupService,
  ) {}
}
