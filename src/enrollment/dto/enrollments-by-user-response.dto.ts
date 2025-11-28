export interface EnrollmentsByUserResponseDto {
    userId: string;
    totalEnrollments: number;
    enrollments: {
        enrollmentId: string;
        event: {
            id: string;
            name: string;
            initialDate: Date;
            finalDate: Date;
            beginHour: String;
            endHour: String;
        };
        status: string;
        enrollmentDate: Date;
    }[];
}