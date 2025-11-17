import { ForbiddenException, HttpStatus } from "@nestjs/common";
import { ENROLLMENT_EXCEPTION_MESSAGES } from "../constant/enrollment.constant";

export class EnrollmentEventOverlapException extends ForbiddenException{
    constructor() {
        super(
            ENROLLMENT_EXCEPTION_MESSAGES.EVENT_OVERLAP.CODE,
            ENROLLMENT_EXCEPTION_MESSAGES.EVENT_OVERLAP.MESSAGE,
        );
    }
}