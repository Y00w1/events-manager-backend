import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { Repository, Equal } from 'typeorm';
import { CreateEnrollmentDto, EnrollmentCreatedResponseDto, UpdateEnrollmentDto } from '../dto';
import { Event } from 'src/event/entities/event.entity';
import { ENROLLMENT_EXCEPTION_MESSAGES, ENROLLMENT_STATUS } from '../constant/enrollment.constant';
import { EnrollmentAlreadyExistsException } from '../exceptions/enrollment-already-exists.exception';
import { EnrollmentEventFullException } from '../exceptions/enrollment-event-full.exception';
import { EnrollmentNotFoundException } from '../exceptions/enrollment-not-found.exception';
import { EnrollmentCancelledResponseDto } from '../dto/enrollment-cancelled-response.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
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
      }
     });
    if (enrollment){
      if (enrollment.status !== ENROLLMENT_STATUS.CANCELLED){
        throw new EnrollmentAlreadyExistsException();
      }
      enrollment.status = status;
      enrollment.enrollmentDate = new Date();
      this.enrollmentRepository.save(enrollment);
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
    return this.toDtoResponse(newEnrollment);
  }

  async cancel(id: string, userId: string): Promise<EnrollmentCancelledResponseDto> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!enrollment) throw new EnrollmentNotFoundException();

    if (enrollment.status === ENROLLMENT_STATUS.CANCELLED) throw new EnrollmentNotFoundException();

    enrollment.status = ENROLLMENT_STATUS.CANCELLED;
    enrollment.cancelledAt = new Date();
    await this.enrollmentRepository.save(enrollment);
    return this.toCancelledDtoResponse(enrollment);
  }

  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
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
