import { ForbiddenException } from "@nestjs/common";
import { ENROLLMENT_EXCEPTION_MESSAGES } from "../constant/enrollment.constant";

export class EnrollmentAlreadyExistsException extends ForbiddenException{
    constructor(){
        super(
            ENROLLMENT_EXCEPTION_MESSAGES.ALREADY_ENROLLED.CODE,
            ENROLLMENT_EXCEPTION_MESSAGES.ALREADY_ENROLLED.MESSAGE,
        )
    }
}