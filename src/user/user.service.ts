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
    const newUser = new this.userModel({
      ...user,
      password: await hash(user.password, 10),
    });
    return newUser.save();
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
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
    userId: string,
    imgUrl: 'avatarUrl' | 'backgroundUrl',
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userModel.findById({ _id: userId }).exec();
    file.filename = `${uuidv4()}-${file.originalname}`;
    const downloadUrl = await this.appService.updloadFile(file);
    await this.appService.deleteFile(user[imgUrl]);
    return this.userModel
      .findByIdAndUpdate(userId, { [imgUrl]: downloadUrl }, { new: true })
      .exec();
  }
}
