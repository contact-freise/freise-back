import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.model';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':user')
  async findById(@Param('user') user: string): Promise<User> {
    return this.userService.findById(user);
  }

  @Post()
  async register(
    @Body() user: Partial<User>,
  ): Promise<{ user: User; auth_token: string }> {
    const newUser = await this.userService.register(user);
    const auth_token = this.jwtService.sign(
      { id: newUser._id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
    return { user: newUser, auth_token };
  }

  @Post('login')
  async login(@Body() body): Promise<{ user: User; auth_token: string }> {
    const user = await this.userService.login(body);
    const auth_token = this.jwtService.sign(
      { id: user._id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
    return { user, auth_token };
  }

  @Post(':user/:imgUrl/upload')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserImgUrl(
    @Param('user') user: string,
    @Param('imgUrl') imgUrl: 'avatarUrl' | 'backgroundUrl',
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.userService.updateUserImgUrl(user, imgUrl, file);
  }
}
