import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.model';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/app.const';
import { UserRequest } from 'src/middleware/auth';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map((user) => this._addAge(user));
  }

  @Get(':user')
  async findById(@Param('user') user: string): Promise<User> {
    const foundUser = await this.userService.findById(user);
    return this._addAge(foundUser);
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
    return { user: this._addAge(newUser), authToken };
  }

  @Post('login')
  async login(@Body() body): Promise<{ user: User; authToken: string }> {
    const user = await this.userService.login(body);
    const authToken = this.jwtService.sign(
      { id: user._id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
    return { user: this._addAge(user), authToken };
  }

  @Post(':imgUrl/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateUserImgUrl(
    @Req() req: UserRequest,
    @Param('imgUrl') imgUrl: 'avatarUrl' | 'backgroundUrl',
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUserImgUrl(
      req.user.id,
      imgUrl,
      file,
    );
    return this._addAge(updatedUser);
  }

  @Put()
  async updateUser(
    @Req() req: UserRequest,
    @Body() updatedFields: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(
      req.user.id,
      updatedFields,
    );
    return this._addAge(updatedUser);
  }

  private _addAge(user: User) {
    if (!user) {
      return null;
    }
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
