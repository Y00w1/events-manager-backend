import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Room, User])],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule],
})
export class EventModule {}
