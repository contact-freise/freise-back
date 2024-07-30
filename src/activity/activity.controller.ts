import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Activity } from './activity.model';
import { UserRequest } from 'src/middleware/auth';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string): Promise<Activity[]> {
    return this.activityService.findById(userId);
  }

  @Post()
  async create(@Req() req: UserRequest): Promise<Activity> {
    return this.activityService.create({ ...req.body, userId: req.user.id });
  }
}
