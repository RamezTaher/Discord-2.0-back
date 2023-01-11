import { Controller, Inject, Post, Get, Body } from '@nestjs/common';
import { IUsersService } from 'src/users/users';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { instanceToPlain } from 'class-transformer';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private usersService: IUsersService,
  ) {}

  @Post('login')
  loginUser() {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return instanceToPlain(await this.usersService.createUser(registerUserDto));
  }

  @Post('logout')
  logout() {}

  @Get('me')
  me() {}
}
