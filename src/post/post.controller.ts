import {
  Controller,
  Get,
  Param,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { UserRequest } from 'src/middleware/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/app.const';
import { PaginatedResult } from 'src/utils/paginated-result';

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

  @Get(':author')
  async getPostsByAuthor(
    @Param('author') author: string,
    @Query('isPicture') isPicture: boolean,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResult<PostModel>> {
    const query = isPicture
      ? { author, imageUrl: { $ne: null } }
      : { author, imageUrl: { $eq: null } };
    return this.postService.getPosts(query, limit, page);
  }
}
