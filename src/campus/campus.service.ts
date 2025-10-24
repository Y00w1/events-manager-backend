import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampusDto } from './dto/create-campus.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { Campus } from './entities/campus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CampusService {

  constructor(
      @InjectRepository(Campus)
      private readonly campusRepository: Repository<Campus>,
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
    return await this.campusRepository.update(id, updateCampusDto);
  }

  async remove(id: string) {
    const campus = await this.campusRepository.findOne({ where: { id } });
    if (!campus) throw new NotFoundException('Campus not found');

    return await this.campusRepository.softRemove(campus);
  }
}
