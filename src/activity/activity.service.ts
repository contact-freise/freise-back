import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity } from './activity.model';
import { Model } from 'mongoose';
import { PaginatedResult } from 'src/utils/paginated-result';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private readonly activityModel: Model<Activity>,
  ) { }

  async find(
    query,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Activity>> {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.activityModel.countDocuments(query),
      this.activityModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('user', 'username avatarUrl')
        .populate('mentionnedUser', 'username avatarUrl')
        .populate(
          'post',
          'author title content mediaUrl likes likesCount dislikes dislikesCount',
        )
        .sort({ createdAt: -1 }),
    ]);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async create(body): Promise<Activity> {
    const newActivity = new this.activityModel(body);
    return newActivity.save();
  }
}
