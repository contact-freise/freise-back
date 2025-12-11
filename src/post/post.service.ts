import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.model';
import { User } from 'src/user/user.model';
import { AppService } from 'src/app.service';
import { randomUUID } from 'crypto';
import { PaginatedResult } from 'src/utils/paginated-result';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly appService: AppService,
  ) { }

  async createPost(
    authorId: string,
    title: string,
    content: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const author = await this.userModel.findById(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    let mediaUrl: string | undefined;
    if (file) {
      file.filename = `users/${authorId}/posts/${randomUUID()}-${file.originalname}`;
      mediaUrl = await this.appService.updloadFile(file);
    }
    const newPost = new this.postModel({
      author,
      title,
      content,
      mediaUrl,
    });
    return newPost.save();
  }

  async getPosts(
    query: any,
    limit: number = 10,
    page: number = 1,
  ): Promise<PaginatedResult<Post>> {
    const skip = Math.max(0, (page - 1) * limit);
    const normalizedLimit = Math.max(1, Math.min(limit, 100)); // Limite entre 1 et 100
    const [total, data] = await Promise.all([
      this.postModel.countDocuments(query),
      this.postModel
        .find(query)
        .skip(skip)
        .limit(normalizedLimit)
        .populate('author')
        .populate('likes')
        .populate('dislikes')
        .sort({ createdAt: -1 }),
    ]);
    return {
      data,
      total,
      page,
      limit: normalizedLimit,
    };
  }
}
