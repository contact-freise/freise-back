import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Activity } from './activity.model';
import { ActivityService } from './activity.service';
import { PaginatedResult } from 'src/utils/paginated-result';
import { UserRequest } from 'src/middleware/auth';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResult<Activity>> {
    return this.activityService.find({}, page, limit);
  }

  @Get(':user')
  async findById(
    @Param('user') user: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedResult<Activity>> {
    return this.activityService.find({ user }, page, limit);
  }

  @Post()
  async create(@Req() req: UserRequest): Promise<Activity> {
    return this.activityService.create({ ...req.body, user: req.user.id });
  }
}
