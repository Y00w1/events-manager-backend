export interface EnrollmentCancelledResponseDto {
    enrollmentId: string;
    eventId: string;
    status: string;
    cancelledAt: Date;
}