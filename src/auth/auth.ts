import { LoginUserParams } from 'src/utils/@types';

export interface IAuthService {
  validateUser(loginUserParams: LoginUserParams);
}
