import { Injectable } from '@nestjs/common';
import { createUserParams } from 'src/utils/@types';
import { IUsersService } from './users';

@Injectable()
export class UsersService implements IUsersService {
  createUser(userParams: createUserParams) {
    console.log(userParams);
  }
}
