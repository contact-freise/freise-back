import {
  Controller,
  Get,
  Post,
  Put,
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

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map((user) => this._addAgeToUser(user));
  }

  @Get(':user')
  async findById(@Param('user') user: string): Promise<User> {
    const foundUser = await this.userService.findById(user);
    return this._addAgeToUser(foundUser);
  }

  @Post()
  async register(
    @Body() user: Partial<User>,
  ): Promise<{ user: User; authToken: string }> {
    const newUser = await this.userService.register(user);
    const authToken = this.jwtService.sign(
      { id: newUser._id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
    return { user: this._addAgeToUser(newUser), authToken };
  }

  @Post('login')
  async login(@Body() body): Promise<{ user: User; authToken: string }> {
    const user = await this.userService.login(body);
    const authToken = this.jwtService.sign(
      { id: user._id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
    return { user: this._addAgeToUser(user), authToken };
  }

  @Post(':user/:imgUrl/upload')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserImgUrl(
    @Param('user') user: string,
    @Param('imgUrl') imgUrl: 'avatarUrl' | 'backgroundUrl',
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUserImgUrl(
      user,
      imgUrl,
      file,
    );
    return this._addAgeToUser(updatedUser);
  }

  @Put(':user')
  async updateUser(
    @Param('user') user: string,
    @Body() updatedFields: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(user, updatedFields);
    return this._addAgeToUser(updatedUser);
  }

  private _addAgeToUser(user: User) {
    if (!user.dob) {
      user.age = null;
      return user;
    }
    const today = new Date();
    let age = today.getFullYear() - user.dob.getFullYear();
    const monthDiff = today.getMonth() - user.dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < user.dob.getDate())
    ) {
      age--;
    }
    user.age = age;
    return user;
  }
}
