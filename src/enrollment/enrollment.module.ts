import { Module } from '@nestjs/common';
import { EnrollmentController } from './controller/enrollment.controller';
import { EnrollmentService } from './service/enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Event])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
