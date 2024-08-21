import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.model';
import { User } from 'src/user/user.model';
import { AppService } from 'src/app.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly appService: AppService,
  ) {}

  async createPost(
    authorId: string,
    title: string,
    content: string,
    file: Express.Multer.File,
  ): Promise<Post> {
    const author = await this.userModel.findById(authorId);
    let imageUrl;
    if (file) {
      file.filename = `users/${authorId}/posts/${uuidv4()}-${file.originalname}`;
      imageUrl = await this.appService.updloadFile(file);
    }
    const newPost = new this.postModel({
      author,
      title,
      content,
      imageUrl,
    });
    return newPost.save();
  }

  async getPostById(post: string): Promise<Post> {
    return this.postModel
      .findById(post)
      .populate('author')
      .populate('likes')
      .populate('dislikes');
  }
}
