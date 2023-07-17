import { Injectable } from '@nestjs/common';
import { IGroupService } from './groups';

@Injectable()
export class GroupsService implements IGroupService {
  createGroup() {}
}
