import { CreateUserParams, FindUserParams } from 'src/utils/@types';
import { User } from 'src/utils/typeorm';

export interface IUsersService {
  createUser(createUserParams: CreateUserParams): Promise<User>;
  findUser(findUserParams: FindUserParams): Promise<User>;
}
