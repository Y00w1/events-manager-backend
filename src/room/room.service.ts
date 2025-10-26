import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { Campus } from '../campus/entities/campus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const { campusId, ...roomData } = createRoomDto;

    const campus = await this.campusRepository.findOne({ where: { id: campusId } });
    if (!campus) throw new NotFoundException('Campus not found');

    const room = this.roomRepository.create({
      ...roomData,
      campus,
    });

    return await this.roomRepository.save(room);
  }

  async findAll() {
    const rooms = await this.roomRepository.find({
      relations: ['campus'],
    });

    // Transformar la respuesta para incluir solo el nombre del campus
    return rooms.map(room => ({
      ...room,
      campus: room.campus ? room.campus.name : null,
    }));
  }

  async findById(id: string): Promise<any> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!room) return null;

    // Transformar la respuesta para incluir solo el nombre del campus
    return {
      ...room,
      campus: room.campus ? room.campus.name : null,
    };
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return await this.roomRepository.update(id, updateRoomDto);
  }

  async remove(id: string) {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');

    room.isActive = false;
    room.state = 'cerrado';
    await this.roomRepository.save(room);

    return await this.roomRepository.softRemove(room);
  }
}
