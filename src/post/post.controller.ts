import { Controller, Get, Param, Post, Body, Req, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { UserRequest } from 'src/middleware/auth';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Req() req: UserRequest,
    @Body()
    body: { title: string; content: string; tags: string[]; imageUrl: string },
  ): Promise<PostModel> {
    const { title, content, tags, imageUrl } = body;
    return this.postService.createPost(
      req.user.id,
      title,
      content,
      tags,
      imageUrl,
    );
  }

  @Get(':post')
  async getPostById(@Param('post') post: string): Promise<PostModel> {
    return this.postService.getPostById(post);
  }

}
