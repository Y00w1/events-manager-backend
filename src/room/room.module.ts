import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entities/room.entity';
import { Campus } from '../campus/entities/campus.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Campus])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [TypeOrmModule],
})
export class RoomModule {}
