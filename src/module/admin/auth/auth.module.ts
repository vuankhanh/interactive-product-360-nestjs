import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from './schemas/account.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import { RefreshToken, refreshTokenSchema } from './schemas/refresh_token.schema';
import { AccountService } from 'src/shared/service/account.service';
import { RefreshTokenService } from 'src/shared/service/refresh_token.service';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      },
      {
        name: RefreshToken.name,
        schema: refreshTokenSchema,
        collection: RefreshToken.name.toLowerCase()
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountService,
    RefreshTokenService,
    AuthGuard
  ]
})
export class AuthModule { }
