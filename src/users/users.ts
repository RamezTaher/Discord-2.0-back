import { CreateUserParams, FindUserParams } from 'src/utils/@types';
import { User } from 'src/utils/typeorm';

export interface IUsersService {
  saveUser(user: User): Promise<User>;
  createUser(createUserParams: CreateUserParams): Promise<User>;
  findUser(findUserParams: FindUserParams): Promise<User>;
}
