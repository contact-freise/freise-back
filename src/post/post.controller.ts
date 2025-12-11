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
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { UserRequest } from 'src/middleware/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/app.const';
import { PaginatedResult } from 'src/utils/paginated-result';
import { CreatePostDto } from 'src/common/dto/create-post.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createPost(
    @Req() req: UserRequest,
    @Body()
    body: { post: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostModel> {
    let postData: any;
    try {
      postData = JSON.parse(body.post);
    } catch (error) {
      throw new BadRequestException('Invalid post data format');
    }
    
    // Créer une instance du DTO et valider
    const createPostDto = plainToInstance(CreatePostDto, postData);
    const errors = await validate(createPostDto);
    
    if (errors.length > 0) {
      const messages = errors.map(error => Object.values(error.constraints || {})).flat();
      throw new BadRequestException(messages);
    }
    
    // S'assurer qu'on a au moins un titre, du contenu ou un fichier
    const hasTitle = createPostDto.title && createPostDto.title.trim() !== '';
    const hasContent = createPostDto.content && createPostDto.content.trim() !== '';
    if (!hasTitle && !hasContent && !file) {
      throw new BadRequestException('Post must have at least a title, content, or a file');
    }
    
    return this.postService.createPost(
      req.user.id,
      createPostDto.title || '',
      createPostDto.content || '',
      file,
    );
  }

  @Get(':author')
  async getPostsByAuthor(
    @Param('author') author: string,
    @Query('withMedia') withMedia: boolean,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResult<PostModel>> {
    const query = withMedia
      ? { author, mediaUrl: { $ne: null } }
      : { author, mediaUrl: { $eq: null } };
    return this.postService.getPosts(query, limit, page);
  }
}
