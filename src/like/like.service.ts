import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './like.model';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async likePost(user: string, post: string): Promise<Like> {
    const foundUser = await this.userModel.findById(user);
    const foundPost = await this.postModel.findById(post);

    if (!foundUser || !foundPost) {
      throw new NotFoundException('User or Post not found');
    }

    const foundLike = await this.likeModel.findOne({
      user: new ObjectId(user),
      post: new ObjectId(post),
      type: 'like',
    });
    if (foundLike) {
      throw new Error('You have already liked this post');
    }

    const like = new this.likeModel({
      user: foundUser,
      post: foundPost,
      type: 'like',
    });
    await like.save();

    await this.postModel.findByIdAndUpdate(post, {
      $inc: { likesCount: 1 },
      $push: { likes: like._id },
    });

    foundUser.likes.push(like._id as Like);
    await foundUser.save();

    return like;
  }

  async unlikePost(user: string, post: string): Promise<void> {
    const like = await this.likeModel.findOne({
      user: new ObjectId(user),
      post: new ObjectId(post),
      type: 'like',
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.postModel.findByIdAndUpdate(post, {
      $inc: { likesCount: -1 },
      $pull: { likes: like._id },
    });

    await this.userModel.findByIdAndUpdate(user, {
      $pull: { likes: like._id },
    });

    await like.deleteOne();
  }

  async dislikePost(user: string, post: string): Promise<Like> {
    const foundUser = await this.userModel.findById(user);
    const foundPost = await this.postModel.findById(post);

    if (!foundUser || !foundPost) {
      throw new NotFoundException('User or Post not found');
    }

    const foundDislike = await this.likeModel.findOne({
      user: new ObjectId(user),
      post: new ObjectId(post),
      type: 'dislike',
    });
    if (foundDislike) {
      throw new Error('You have already disliked this post');
    }

    const dislike = new this.likeModel({
      user: foundUser,
      post: foundPost,
      type: 'dislike',
    });
    await dislike.save();

    await this.postModel.findByIdAndUpdate(post, {
      $inc: { dislikesCount: 1 },
      $push: { dislikes: dislike._id },
    });

    foundUser.dislikes.push(dislike._id as Like);
    await foundUser.save();

    return dislike;
  }

  async undislikePost(user: string, post: string): Promise<void> {
    const dislike = await this.likeModel.findOne({
      user: new ObjectId(user),
      post: new ObjectId(post),
      type: 'dislike',
    });
    if (!dislike) {
      throw new NotFoundException('Dislike not found');
    }

    await this.postModel.findByIdAndUpdate(post, {
      $inc: { dislikesCount: -1 },
      $pull: { dislikes: dislike._id },
    });

    await this.userModel.findByIdAndUpdate(user, {
      $pull: { dislikes: dislike._id },
    });

    await dislike.deleteOne();
  }
}
