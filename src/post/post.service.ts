import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.model';
import { User } from 'src/user/user.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createPost(
    authorId: string,
    title: string,
    content: string,
    tags: string[],
    imageUrl: string,
  ): Promise<Post> {
    const author = await this.userModel.findById(authorId);
    const newPost = new this.postModel({
      author,
      title,
      content,
      tags,
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
