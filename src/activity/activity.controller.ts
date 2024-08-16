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

  @Get(':user')
  async findById(@Param('user') user: string): Promise<Activity[]> {
    return this.activityService.findById(user);
  }

  @Post()
  async create(@Req() req: UserRequest): Promise<Activity> {
    return this.activityService.create({ ...req.body, user: req.user.id });
  }
}
