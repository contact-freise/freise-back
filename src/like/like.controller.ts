import { Controller, Post, Delete, Req, Query, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { UserRequest } from 'src/middleware/auth';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post('like/:post')
  async likePost(@Req() req: UserRequest, @Param('post') post: string) {
    return this.likeService.likePost(req.user.id, post);
  }

  @Delete('like/:post')
  async unlikePost(@Req() req: UserRequest, @Param('post') post: string) {
    return this.likeService.unlikePost(req.user.id, post);
  }

  @Post('dislike/:post')
  async dislikePost(@Req() req: UserRequest, @Param('post') post: string) {
    return this.likeService.dislikePost(req.user.id, post);
  }

  @Delete('dislike/:post')
  async undislikePost(@Req() req: UserRequest, @Param('post') post: string) {
    return this.likeService.undislikePost(req.user.id, post);
  }
}