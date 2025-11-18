export interface EnrollmentsByEventResponseDto {
    eventId: string;
    totalEnrollments: number;
    enrollments: {
        enrollmentId: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        status: string;
        enrollmentDate: Date;
    }[];
}