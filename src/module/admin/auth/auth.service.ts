import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountDocument } from './schemas/account.schema';
import mongoose from 'mongoose';
import { RefreshTokenService } from 'src/shared/service/refresh_token.service';
import { AccountService } from 'src/shared/service/account.service';
import { CustomUnauthorizedException } from 'src/shared/exception/custom-exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private accountService: AccountService
  ) { }

  createAccessToken(account: AccountDocument): string {
    const { username, role } = account;
    const payload = { username, role };

    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_LIFE
    });

    return token;
  }

  async createRefreshToken(account: AccountDocument): Promise<string> {
    const { username, role } = account;
    const payload = { username, role };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_LIFE
    });

    const refreshTokenLife: number = parseInt(process.env.REFRESH_TOKEN_LIFE);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshTokenLife);

    const accountId: mongoose.Types.ObjectId = account._id;
    await this.refreshTokenService.findOneAndRemove(accountId);
    await this.refreshTokenService.create(accountId, refreshToken, expiresAt);

    return refreshToken;
  }

  verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET
      });
      return decoded;
    } catch (error) {
      throw new CustomUnauthorizedException('Token không hợp lệ');
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<string> {
    try {
      const decode = this.jwtService.decode(refreshToken);
      const username = decode['username'];
      const account = await this.accountService.findOne({ username });
      const accountId: string = account._id.toString();

      const refreshTokenDoc = await this.refreshTokenService.findOne(accountId, refreshToken);
      if (!refreshTokenDoc) {
        throw new CustomUnauthorizedException('Invalid refresh token');
      }
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET
      });

      return this.createAccessToken(account);
    } catch (error) {
      throw new CustomUnauthorizedException('Invalid refresh token');
    }
  }
}
