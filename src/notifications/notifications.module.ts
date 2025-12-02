import { Module } from '@nestjs/common';
import { NotificationsService } from './service/notifications.service';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
