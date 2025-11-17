import { CANCELLED } from "dns";

export const ENROLLMENT_API_ENTRY_POINT = {
    BASE: '/enrollments',
    CREATE: '/create',
    CANCEL: '/:id/cancel',
};

export const ENROLLMENT_STATUS = {
    ENROLLED: 'ENROLLED',
    WAITLISTED: 'WAITLISTED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    ATTENDED: 'ATTENDED',
    NO_SHOW: 'NO_SHOW',
};

export const ENROLLMENT_EXCEPTION_MESSAGES = {
    EVENT_OVERLAP:{
        MESSAGE: 'The user is already enrolled in another event that overlaps with this event.',
        CODE: 'EVENT_OVERLAP'
    },
    EVENT_FULL: {
        MESSAGE: 'The event is full. Enrollment cannot be completed.',
        CODE: 'EVENT_FULL'
    },
    ALREADY_ENROLLED: {
        MESSAGE: 'The user is already enrolled in this event.',
        CODE: 'ALREADY_ENROLLED'
    },
    ENROLLMENT_NOT_FOUND: {
        MESSAGE: 'Enrollment not found.',
        CODE: 'ENROLLMENT_NOT_FOUND'
    },
    CANCELLATION_NOT_ALLOWED: {
        MESSAGE: 'Cancellation period has expired. Enrollment cannot be cancelled.',
        CODE: 'CANCELLATION_NOT_ALLOWED'
    },
};