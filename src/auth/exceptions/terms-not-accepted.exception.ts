import { ForbiddenException } from "@nestjs/common";
import { AUTH_EXCEPTION_MESSAGES } from "../constant/auth.constant";

export class TermsNotAcceptedException extends ForbiddenException{
    constructor(){
        super(
            AUTH_EXCEPTION_MESSAGES.TERMS_NOT_ACCEPTED.CODE,
            AUTH_EXCEPTION_MESSAGES.TERMS_NOT_ACCEPTED.MESSAGE,
        )}
}