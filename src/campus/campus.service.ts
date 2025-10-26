import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Campus } from './entities/campus.entity';
import { Room } from '../room/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CampusService {

  constructor(
      @InjectRepository(Campus)
      private readonly campusRepository: Repository<Campus>,
      @InjectRepository(Room)
      private readonly roomRepository: Repository<Room>,
    ) {}

 async create(createCampusDto: CreateCampusDto) {

    const campus = this.campusRepository.create(createCampusDto);
    return await this.campusRepository.save(campus);
  }

  async findAll() {
    return await this.campusRepository.find();
  }

  async findById(id: string): Promise<Campus | null> {
      return this.campusRepository.findOne({ where: { id } });
    }

  async update(id: string, updateCampusDto: UpdateCampusDto) {
    const campus = await this.campusRepository.findOne({ where: { id } });
    if (!campus) throw new NotFoundException('Campus not found');

    // Si se está actualizando el estado del campus, actualizar todas sus rooms
    if (updateCampusDto.state && updateCampusDto.state !== campus.state) {
      await this.roomRepository.update(
        { campus: { id } },
        { state: updateCampusDto.state }
      );
    }

    return await this.campusRepository.update(id, updateCampusDto);
  }

  async remove(id: string) {
    const campus = await this.campusRepository.findOne({
      where: { id },
      relations: ['rooms']
    });
    if (!campus) throw new NotFoundException('Campus not found');

    // Marcar todas las rooms del campus como inactivas, cerradas y eliminarlas (soft delete)
    if (campus.rooms && campus.rooms.length > 0) {
      for (const room of campus.rooms) {
        room.isActive = false;
        room.state = 'cerrado';
        await this.roomRepository.save(room);
        await this.roomRepository.softRemove(room);
      }
    }

    // Marcar el campus como inactivo, cerrado y eliminarlo (soft delete)
    campus.isActive = false;
    campus.state = 'cerrado';
    await this.campusRepository.save(campus);

    return await this.campusRepository.softRemove(campus);
  }
}
