import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from 'src/utils/types';

@Module({
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
