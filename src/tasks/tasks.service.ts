import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 0 * * *')
  handleCron() {
    this.logger.debug('Midnight cron');
  }

  @Interval(60 * 60 * 1000)
  handleInterval() {
    this.logger.debug(
      `Uptime ${Math.round(process.uptime() / (60 * 60))} hours`,
    );
  }

  @Timeout(100)
  handleTimeout() {
    this.logger.debug('Server started 🍓');
  }
}
