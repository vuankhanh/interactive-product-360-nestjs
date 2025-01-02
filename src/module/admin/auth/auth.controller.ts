import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Account } from './schemas/account.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptor/format_response.interceptor';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { AccountService } from 'src/shared/service/account.service';
import { CustomConflictException, CustomUnauthorizedException } from 'src/shared/exception/custom-exception';

@Controller()
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class AuthController {
  logger: Logger = new Logger(AuthController.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService
  ) { }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Creating user.');
      const query = { username: signUpDto.username };
      const isExist = await this.accountService.findOne(query);
      if (isExist) {
        throw new CustomConflictException('Tên đăng nhập đã tồn tại');
      }

      const signUp = new Account(
        signUpDto.username,
        signUpDto.password,
        signUpDto.firstName,
        signUpDto.lastName,
        signUpDto.role,
        signUpDto.email
      );
      const account = await this.accountService.create(signUp);

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);
      return { accessToken, refreshToken }
    } catch (error) {
      this.logger.error('Something went wrong in signup:', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      this.logger.log('Signing in user.');
      const { username, password } = signInDto;
      const account = await this.accountService.validateAccount(username, password);
      if (!account) {
        throw new CustomUnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
      }

      const accessToken = this.authService.createAccessToken(account);
      const refreshToken = await this.authService.createRefreshToken(account);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Something went wrong in signin:', error);
      throw error;
    }
  }

  @Post('refresh_token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    try {
      this.logger.log('Refreshing token.');
      const accessToken = await this.authService.verifyRefreshToken(refreshToken);
      return { accessToken }
    } catch (error) {
      this.logger.error('Something went wrong in refreshToken:', error);
      throw error;
    }
  }

  @Post('config')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  config() {
    const config = {
      serverTime: Date.now()
    }

    return config;
  }
}