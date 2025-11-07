import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentService } from '../service/enrollment.service';
import { ENROLLMENT_API_ENTRY_POINT } from '../constant/enrollment.constant';
import { CreateEnrollmentDto, EnrollmentCreatedResponseDto, UpdateEnrollmentDto } from '../dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller(ENROLLMENT_API_ENTRY_POINT.BASE)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(ENROLLMENT_API_ENTRY_POINT.CREATE)
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @GetCurrentUserId() userId: string): Promise<EnrollmentCreatedResponseDto> {
    return this.enrollmentService.create(createEnrollmentDto, userId);
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentService.remove(+id);
  }
}
