import * as bcrypt from 'bcrypt';
import { Hasher } from "./crypto.interface";
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptAdapter implements Hasher{
    async hash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt);
    }

    async compare(data: string, hashedData: string): Promise<boolean> {
        return bcrypt.compare(data, hashedData);
    }
}