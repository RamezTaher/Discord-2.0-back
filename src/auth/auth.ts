import { LoginUserParams } from 'src/utils/@types';
import { User } from 'src/utils/typeorm';

export interface IAuthService {
  validateUser(loginUserParams: LoginUserParams): Promise<User | null>;
}
