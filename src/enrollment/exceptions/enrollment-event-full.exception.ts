import { ForbiddenException } from "@nestjs/common";
import { ENROLLMENT_EXCEPTION_MESSAGES } from "../constant/enrollment.constant";

export class EnrollmentEventFullException extends ForbiddenException{
    constructor(){
        super(
            ENROLLMENT_EXCEPTION_MESSAGES.EVENT_FULL.CODE,
            ENROLLMENT_EXCEPTION_MESSAGES.EVENT_FULL.MESSAGE,
        )
    }
} 