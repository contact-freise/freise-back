import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserRequest } from 'src/middleware/auth';
import { CreateCommentDto } from 'src/common/dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Req() req: UserRequest, @Body() commentDto: CreateCommentDto) {
    return this.commentService.create({
      ...commentDto,
      author: req.user.id,
    });
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.commentService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Comment not found');
    }
    return deleted;
  }
}
