import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IUsersService } from 'src/users/users';
import { LoginUserParams } from 'src/utils/@types';
import { Services } from 'src/utils/constants';
import { compare } from 'src/utils/helpers';
import { IAuthService } from './auth';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUsersService,
  ) {}
  async validateUser(loginUserParams: LoginUserParams) {
    const user = await this.userService.findUser({
      email: loginUserParams.email,
    });

    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordCorrect = await compare(
      loginUserParams.password,
      user.password,
    );
    return isPasswordCorrect ? user : null;
  }
}
