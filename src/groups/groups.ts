import { CreateGroupParams, FetchGroupsParams } from 'src/utils/@types';
import { Group } from 'src/utils/typeorm';

export interface IGroupService {
  createGroup(params: CreateGroupParams);
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  findGroupById(id: number): Promise<Group>;
  saveGroup(group: Group): Promise<Group>;
}
