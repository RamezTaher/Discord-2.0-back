import { Controller, Inject, Post, Get, Body } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Routes, Services } from 'src/utils/types';
import { IAuthService } from './auth';
import { RegisterUserDto } from './dtos/RegisterUser.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Post('login')
  loginUser() {}

  @Post('register')
  @UsePipes(ValidationPipe)
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
  }

  @Post('logout')
  logout() {}

  @Get('me')
  me() {}
}
