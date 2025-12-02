import { ForbiddenException } from "@nestjs/common";
import { USER_EXCEPTION_MESSAGES } from "../constant/user.constant";

export class AlreadyUsedEmailException extends ForbiddenException{
    constructor(){
        super(
        USER_EXCEPTION_MESSAGES.ALREADY_USED_EMAIL.MESSAGE,
        USER_EXCEPTION_MESSAGES.ALREADY_USED_EMAIL.CODE,
    )}
    }