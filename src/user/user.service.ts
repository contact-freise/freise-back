import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AppService } from 'src/app.service';
import { randomUUID } from 'crypto';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly appService: AppService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async register(user: Partial<User> & { username: string; email: string; password: string }): Promise<User> {
    const { username, email } = user;
    const foundUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (foundUser) {
      throw new UnauthorizedException('User or email already exists');
    }

    const storageBucketUrl = this.appService.getStorageBucketUrl();
    const randomHammy = Math.floor(Math.random() * 20);
    const avatar = `/hammy/hammy-pfp (${randomHammy}).png`;
    const background = `/background.jpg`;
    const newUser = new this.userModel({
      ...user,
      avatarUrl: `${storageBucketUrl}/assets${encodeURIComponent(avatar)}?alt=media`,
      backgroundUrl: `${storageBucketUrl}/assets${encodeURIComponent(background)}?alt=media`,
      password: await hash(user.password, 10),
    });
    return newUser.save();
  }

  async findById(user: string): Promise<User | null> {
    return this.userModel.findById(user);
  }

  async login(loginDto: { username: string; password: string }): Promise<User> {
    const user = await this.userModel.findOne({ username: loginDto.username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validPassword = await compare(loginDto.password, user?.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async updateUserImgUrl(
    user: string,
    imgUrl: 'avatarUrl' | 'backgroundUrl',
    file: Express.Multer.File,
  ): Promise<User | null> {
    const foundUser = await this.userModel.findById(user);
    if (!foundUser) {
      return null;
    }
    file.filename = `users/${user}/${randomUUID()}-${file.originalname}`;
    const downloadUrl = await this.appService.updloadFile(file);
    await this.appService.deleteFile(foundUser[imgUrl] || '');
    return this.userModel.findByIdAndUpdate(
      user,
      { [imgUrl]: downloadUrl },
      { new: true },
    );
  }

  async updateUser(user: string, updatedFields: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(user, updatedFields, { new: true });
  }
}
