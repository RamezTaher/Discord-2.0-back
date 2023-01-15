import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './utils/LocalStrategy';
import { Serializer } from './utils/Serilazier';

@Module({
  imports: [UsersModule],
  providers: [
    LocalStrategy,
    Serializer,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
