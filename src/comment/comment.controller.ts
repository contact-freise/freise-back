import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserRequest } from 'src/middleware/auth';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Req() req: UserRequest, @Body() comment) {
    return this.commentService.create({
      ...comment,
      user: req.user.id,
    });
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentService.delete(id);
  }
}
