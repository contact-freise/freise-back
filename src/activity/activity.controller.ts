import { Controller, Get, Param, Post, Query, Req, Body } from '@nestjs/common';
import { Activity } from './activity.model';
import { ActivityService } from './activity.service';
import { PaginatedResult } from 'src/utils/paginated-result';
import { UserRequest } from 'src/middleware/auth';
import { CreateActivityDto } from 'src/common/dto/create-activity.dto';

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
  async create(@Req() req: UserRequest, @Body() activityDto: CreateActivityDto): Promise<Activity> {
    return this.activityService.create({ ...activityDto, user: req.user.id });
  }
}
