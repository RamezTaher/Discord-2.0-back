import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserParams,
  FindUserOptions,
  FindUserParams,
} from 'src/utils/@types';
import { hashPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { Repository } from 'typeorm';
import { IUsersService } from './users';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async findUser(
    findUserParams: FindUserParams,
    options?: FindUserOptions,
  ): Promise<User> {
    {
      const selections: (keyof User)[] = [
        'email',
        'firstName',
        'lastName',
        'id',
      ];
      const selectionsWithPassword: (keyof User)[] = [
        ...selections,
        'password',
      ];
      return this.userRepository.findOne(findUserParams, {
        select: options?.selectAll ? selectionsWithPassword : selections,
      });
    }
  }
  async createUser(userParams: CreateUserParams): Promise<User> {
    const hashedPassword = await hashPassword(userParams.password);
    const emailExists = await this.userRepository.findOne({
      email: userParams.email,
    });
    const usernameExists = await this.userRepository.findOne({
      userName: userParams.userName,
    });

    if (emailExists)
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.CONFLICT,
      );
    if (usernameExists)
      throw new HttpException(
        'User already exists with this username',
        HttpStatus.CONFLICT,
      );
    const newUser = this.userRepository.create({
      ...userParams,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
