import { createUserParams } from 'src/utils/@types';

export interface IUsersService {
  createUser(userParams: createUserParams);
}
