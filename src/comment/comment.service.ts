import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(comment): Promise<Comment> {
    const createdComment = new this.commentModel(comment);
    return createdComment.save();
  }

  async findByPost(post: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post })
      .populate('author', 'username avatarUrl');
  }

  async delete(comment: string): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(comment);
  }
}
