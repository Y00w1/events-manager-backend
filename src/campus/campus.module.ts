import { Module } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CampusController } from './campus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campus } from './entities/campus.entity';
import { Room } from 'src/room/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campus, Room])],
  controllers: [CampusController],
  providers: [CampusService],
})
export class CampusModule {}
