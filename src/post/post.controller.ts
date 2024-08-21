import {
  Controller,
  Get,
  Param,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { UserRequest } from 'src/middleware/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/app.const';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createPost(
    @Req() req: UserRequest,
    @Body()
    body: { post: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostModel> {
    const { title, content } = JSON.parse(body.post);
    return this.postService.createPost(req.user.id, title, content, file);
  }

  @Get(':post')
  async getPostById(@Param('post') post: string): Promise<PostModel> {
    return this.postService.getPostById(post);
  }
}
