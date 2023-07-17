import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../utils/constants';
import { Group } from '../utils/typeorm';
import { IGroupService } from './groups';
import { IUsersService } from 'src/users/users';
import { CreateGroupParams, FetchGroupsParams } from 'src/utils/@types';

@Injectable()
export class GroupsService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS)
    private readonly usersService: IUsersService,
  ) {}
  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;
    const usersPromise = params.users.map((email) =>
      this.usersService.findUser({ email }),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    console.log(users);
    const group = this.groupRepository.create({ users, creator, title });
    return this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: [params.userId] })
      .getMany();
  }

  getGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users'],
    });
  }
}
