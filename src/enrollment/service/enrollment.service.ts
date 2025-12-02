import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { Repository, Equal } from 'typeorm';
import { CreateEnrollmentDto, EnrollmentCreatedResponseDto, EnrollmentsByEventResponseDto, EnrollmentsByUserResponseDto, UpdateEnrollmentDto } from '../dto';
import { Event } from 'src/event/entities/event.entity';
import { ENROLLMENT_STATUS } from '../constant/enrollment.constant';
import { EnrollmentAlreadyExistsException } from '../exceptions/enrollment-already-exists.exception';
import { EnrollmentEventFullException } from '../exceptions/enrollment-event-full.exception';
import { EnrollmentNotFoundException } from '../exceptions/enrollment-not-found.exception';
import { EnrollmentCancelledResponseDto } from '../dto/enrollment-cancelled-response.dto';
import { SendTemplateDto } from 'src/notifications/dto/send-template.dto';
import { NOTIFICATION_TEMPLATES } from 'src/notifications/constants/notifications.constants';
import { NotificationsService } from 'src/notifications/service/notifications.service';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto, userId: string): Promise<EnrollmentCreatedResponseDto> {
    const acceptWaitlist = createEnrollmentDto.acceptWaitlist || false;

    const event = await this.eventRepository.findOne({ where: { id: createEnrollmentDto.eventId } });
    if (!event) throw new Error('Event not found'); //TODO: Custom Exception

    let status = ENROLLMENT_STATUS.ENROLLED;
    const enrollment = await this.enrollmentRepository.findOne({
      where:{
        user: { id: userId },
        event: { id: event.id }
      },
      relations: ['event', 'user'],
     });
    if (enrollment){
      if (enrollment.status !== ENROLLMENT_STATUS.CANCELLED){
        throw new EnrollmentAlreadyExistsException();
      }
      enrollment.status = status;
      enrollment.enrollmentDate = new Date();
      this.enrollmentRepository.save(enrollment);
      await this.sendEnrollmentNotificationEmail(enrollment, event, status);
      return this.toDtoResponse(enrollment);
    } 

    const enrolledCount = await this.countEnrolledInEvent(event.id);
    const hasCapacity = enrolledCount < event.maxAttendees;
    if (!hasCapacity) {
      if (!acceptWaitlist) throw new EnrollmentEventFullException();
      status = ENROLLMENT_STATUS.WAITLISTED;
    }

    const newEnrollment = this.enrollmentRepository.create({
      user: { id: userId },
      event: { id: event.id },
      status,
      enrollmentDate: new Date(),
    });

    await this.enrollmentRepository.save(newEnrollment);
    const savedEnrollment = await this.enrollmentRepository.findOneOrFail({
      where: { id: newEnrollment.id },
      relations: ['event', 'user'],
    });

    await this.sendEnrollmentNotificationEmail(savedEnrollment, event, status);
    
    return this.toDtoResponse(savedEnrollment);
  }

  async cancel(id: string, userId: string): Promise<EnrollmentCancelledResponseDto> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['event', 'user'],
    });

    if (!enrollment) throw new EnrollmentNotFoundException();

    if (enrollment.status === ENROLLMENT_STATUS.CANCELLED) throw new EnrollmentNotFoundException();

    enrollment.status = ENROLLMENT_STATUS.CANCELLED;
    enrollment.cancelledAt = new Date();
    await this.enrollmentRepository.save(enrollment);

    await this.sendEnrollmentNotificationEmail(enrollment, enrollment.event, ENROLLMENT_STATUS.CANCELLED);

    return this.toCancelledDtoResponse(enrollment);
  }

  async findByUser(userId: string): Promise<EnrollmentsByUserResponseDto> {
    const enrollments: Enrollment[] = await this.enrollmentRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'user'],
    });
    if (enrollments.length == 0) throw new EnrollmentNotFoundException();
    return this.toDtoEnrollmentsByUserResponse(enrollments);
  }

  async findByEvent(eventId: string): Promise<EnrollmentsByEventResponseDto> {
    const enrollments: Enrollment[] = await this.enrollmentRepository.find({
      where: { event: { id: eventId } },
      relations: ['user', 'event'],
    });
    if (enrollments.length == 0) throw new EnrollmentNotFoundException();
    return this.toDtoEnrollmentsByEventResponse(enrollments);
  }


  private eventsOverlap(eventA: Event, eventB: Event): boolean {
    const datesOverlap = eventA.initialDate <= eventB.finalDate && eventA.finalDate >= eventB.initialDate;
    if (!datesOverlap) return false;
    return eventA.beginHour < eventB.endHour && eventA.endHour > eventB.beginHour;
  }

  private async findEnrolledWithEvents(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { user: { id: userId }, status: ENROLLMENT_STATUS.ENROLLED },
      relations: ['event'],
    });
  }

  private async countEnrolledInEvent(eventId: string): Promise<number> {
    return this.enrollmentRepository.count({
      where: { 
        event: { id: eventId }, 
        status: Equal(ENROLLMENT_STATUS.ENROLLED) 
      },
    });
  }

  private async sendEnrollmentNotificationEmail(enrollment: Enrollment, event: Event, status: string): Promise<void> {
    const templateData = new SendTemplateDto();
    const dynamicData: Object = {
      first_name: enrollment.user.name,
      event_name: event.name,
      event_date: event.initialDate.toDateString(),
      event_time: `${event.beginHour} - ${event.endHour}`,
      event_location: `${event.room?.campus?.name} - ${event.room?.type}`,
      event_modality: event.modality,
    };
    templateData.to = enrollment.user.email;
    templateData.dynamicData = dynamicData;
    templateData.templateId = status == ENROLLMENT_STATUS.ENROLLED
      ? NOTIFICATION_TEMPLATES.EVENT_ENROLLED
      : NOTIFICATION_TEMPLATES.EVENT_UNENROLLED;

    await this.notificationsService.sendTemplateEmail(templateData);
  }

  private async toDtoEnrollmentsByEventResponse(enrollments: Enrollment[]): Promise<EnrollmentsByEventResponseDto> {
    return {
      eventId: enrollments[0].event.id,
      totalEnrollments: enrollments.length,
      enrollments: enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        user: {
          id: enrollment.user.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
        },
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
      })),
    };
  }

  private async toDtoEnrollmentsByUserResponse(enrollments: Enrollment[]): Promise<EnrollmentsByUserResponseDto> {
    return {
      userId: enrollments[0].user.id,
      totalEnrollments: enrollments.length,
      enrollments: enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        event: {
          id: enrollment.event.id,
          name: enrollment.event.name,
          initialDate: enrollment.event.initialDate,
          finalDate: enrollment.event.finalDate,
          beginHour: enrollment.event.beginHour,
          endHour: enrollment.event.endHour,
        },
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
      })),
    };
  }

  private async toDtoResponse(enrollment: Enrollment): Promise<EnrollmentCreatedResponseDto> {
    return {
      enrollmentId: enrollment.id,
      eventId: enrollment.event.id,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate,
    };
  }

  private async toCancelledDtoResponse(enrollment: Enrollment): Promise<EnrollmentCancelledResponseDto> {
    return {
      enrollmentId: enrollment.id,
      eventId: enrollment.event.id,
      status: enrollment.status,
      cancelledAt: enrollment.cancelledAt!,
    };
  }
}
