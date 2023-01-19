import {
  Controller,
  Inject,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { IUsersService } from 'src/users/users';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/Guard';
import { Request, Response } from 'express';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private usersService: IUsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Session() sess, @Res() res: Response) {
    console.log(sess);
    return res.send(HttpStatus.OK);
  }

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return instanceToPlain(await this.usersService.createUser(registerUserDto));
  }

  @Post('logout')
  logout() {}

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  me(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }
}
