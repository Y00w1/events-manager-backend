import { Module } from '@nestjs/common';
import { EnrollmentController } from './controller/enrollment.controller';
import { EnrollmentService } from './service/enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Event } from 'src/event/entities/event.entity';
import { EventAccessGuard } from 'src/common/guard';
import { NotificationsService } from 'src/notifications/service/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Event])],
  controllers: [EnrollmentController],
  providers: [
    EnrollmentService, 
    EventAccessGuard,
    NotificationsService,
  ],
})
export class EnrollmentModule {}
