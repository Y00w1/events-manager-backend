import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentService } from '../service/enrollment.service';
import { ENROLLMENT_API_ENTRY_POINT } from '../constant/enrollment.constant';
import { CreateEnrollmentDto, EnrollmentCancelledResponseDto, EnrollmentCreatedResponseDto, EnrollmentsByEventResponseDto, EnrollmentsByUserResponseDto, UpdateEnrollmentDto } from '../dto';
import { GetCurrentUserId } from 'src/common/decorators';
import { UseRoles } from 'nest-access-control';
import { UseGuards } from '@nestjs/common';
import { EventAccessGuard } from 'src/common/guard';

@Controller(ENROLLMENT_API_ENTRY_POINT.BASE)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(ENROLLMENT_API_ENTRY_POINT.CREATE)
  @UseRoles({
    resource: 'enrollment',
    action: 'create',
    possession: 'own',
  })
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto, @GetCurrentUserId() userId: string): Promise<EnrollmentCreatedResponseDto> {
    return this.enrollmentService.create(createEnrollmentDto, userId);
  }

  @Patch(ENROLLMENT_API_ENTRY_POINT.CANCEL)
  @UseRoles({
    resource: 'enrollment',
    action: 'delete',
    possession: 'own',
  })
  async cancel(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<EnrollmentCancelledResponseDto> {
    return this.enrollmentService.cancel(id, userId);
  }

  @Get(ENROLLMENT_API_ENTRY_POINT.MY_ENROLLMENTS)
  @UseRoles({
    resource: 'enrollment',
    action: 'read',
    possession: 'own',
  })
  async findByUser(@GetCurrentUserId() userId: string):Promise<EnrollmentsByUserResponseDto> {
    return this.enrollmentService.findByUser(userId);
  }

  @Get(ENROLLMENT_API_ENTRY_POINT.BY_EVENT )
  @UseRoles({
    resource: 'enrollment',
    action: 'read',
    possession: 'any',
  })
  @UseGuards(EventAccessGuard)
  async findByEvent(@Param('eventId') eventId: string): Promise<EnrollmentsByEventResponseDto> {
    return this.enrollmentService.findByEvent(eventId);
  }
}
