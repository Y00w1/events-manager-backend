import { NotFoundException } from "@nestjs/common";
import { ENROLLMENT_EXCEPTION_MESSAGES } from "../constant/enrollment.constant";

export class EnrollmentNotFoundException extends NotFoundException{
    constructor(){
        super(ENROLLMENT_EXCEPTION_MESSAGES.ENROLLMENT_NOT_FOUND.CODE,
             ENROLLMENT_EXCEPTION_MESSAGES.ENROLLMENT_NOT_FOUND.MESSAGE
        );
    }
}