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
    query: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<Activity>> {
    const skip = Math.max(0, (page - 1) * limit);
    const normalizedLimit = Math.max(1, Math.min(limit, 100)); // Limite entre 1 et 100
    const [total, data] = await Promise.all([
      this.activityModel.countDocuments(query),
      this.activityModel
        .find(query)
        .skip(skip)
        .limit(normalizedLimit)
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
      limit: normalizedLimit,
    };
  }

  async create(body): Promise<Activity> {
    const newActivity = new this.activityModel(body);
    return newActivity.save();
  }
}
