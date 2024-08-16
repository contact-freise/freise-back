import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AppService } from 'src/app.service';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly appService: AppService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async register(user: Partial<User>): Promise<User> {
    const { username, email } = user;
    const foundUser = await this.userModel
      .findOne({ $or: [{ username }, { email }] })
      .exec();
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

  async findById(user: string): Promise<User> {
    return this.userModel.findById(user).exec();
  }

  async login(body): Promise<User> {
    const user = await this.userModel
      .findOne({ username: body.username })
      .exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validPassword = await compare(body.password, user?.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async updateUserImgUrl(
    user: string,
    imgUrl: 'avatarUrl' | 'backgroundUrl',
    file: Express.Multer.File,
  ): Promise<User> {
    const foundUser = await this.userModel.findById({ _id: user }).exec();
    file.filename = `users/${user}/${uuidv4()}-${file.originalname}`;
    const downloadUrl = await this.appService.updloadFile(file);
    await this.appService.deleteFile(foundUser[imgUrl]);
    return this.userModel
      .findByIdAndUpdate(user, { [imgUrl]: downloadUrl }, { new: true })
      .exec();
  }

  async updateUser(user: string, updatedFields: Partial<User>): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(user, updatedFields, { new: true })
      .exec();
  }
}
