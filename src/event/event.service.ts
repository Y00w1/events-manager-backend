import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
import { Room } from '../room/entities/room.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const { roomId, responsiblePersonId, modality, maxAttendees, ...eventData } = createEventDto;

    // Crear el objeto base del evento
    const eventCreateData: any = {
      ...eventData,
      modality,
      maxAttendees,
    };

    // Validar y agregar el room solo si NO es modalidad Virtual
    if (modality !== 'Virtual') {
      if (!roomId) throw new NotFoundException('Room is required for non-virtual events');
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) throw new NotFoundException('Room not found');

      // Validar que la capacidad del salón sea suficiente
      if (maxAttendees > room.capacity) {
        throw new BadRequestException(
          `El número de asistentes (${maxAttendees}) supera la capacidad de la sala (${room.capacity}). Por favor, elige una sala más grande o reduce el número de asistentes.`
        );
      }

      eventCreateData.room = room;
    } else if (roomId) {
      // Si es Virtual pero se proporciona roomId, validar que exista y su capacidad
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) throw new NotFoundException('Room not found');

      // Validar capacidad también para eventos virtuales con salón
      if (maxAttendees > room.capacity) {
        throw new BadRequestException(
          `El número de asistentes (${maxAttendees}) supera la capacidad de la sala (${room.capacity}). Por favor, elige una sala más grande o reduce el número de asistentes.`
        );
      }

      eventCreateData.room = room;
    }

    // Validar y agregar el usuario responsable si se proporciona
    if (responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({ where: { id: responsiblePersonId } });
      if (!responsiblePerson) throw new NotFoundException('Responsible person not found');
      eventCreateData.responsiblePerson = responsiblePerson;
    }

    const event = this.eventRepository.create(eventCreateData);
    const savedEvent = await this.eventRepository.save(event) as unknown as Event;

    // Transformar la respuesta para limpiar campos innecesarios
    return this.transformEventData(savedEvent);
  }

  private transformEventData(event: Event) {
    return {
      id: event.id,
      name: event.name,
      initialDate: event.initialDate,
      finalDate: event.finalDate,
      beginHour: event.beginHour,
      endHour: event.endHour,
      room: event.room ? {
        id: event.room.id,
        type: event.room.type,
        capacity: event.room.capacity,
        state: event.room.state,
        equipment: event.room.equipment,
        campus: event.room.campus ? {
          id: event.room.campus.id,
          name: event.room.campus.name,
          state: event.room.campus.state,
        } : null,
      } : null,
      organizationArea: event.organizationArea,
      description: event.description,
      state: event.state,
      responsiblePerson: event.responsiblePerson ? {
        id: event.responsiblePerson.id,
        name: event.responsiblePerson.name,
        email: event.responsiblePerson.email,
        phone: event.responsiblePerson.phone,
      } : null,
      modality: event.modality,
      maxAttendees: event.maxAttendees,
      urlImage: event.urlImage,
    };
  }

  async findAll(filters?: FilterEventDto) {
    // Construir el objeto where dinámicamente
    const where: any = { isActive: true };

    // Aplicar filtros opcionales
    if (filters?.roomId) {
      where.room = { id: filters.roomId };
    }

    if (filters?.organizationArea) {
      where.organizationArea = filters.organizationArea;
    }

    if (filters?.modality) {
      where.modality = filters.modality;
    }

    if (filters?.state) {
      where.state = filters.state;
    }

    // Filtro de búsqueda (busca en nombre y descripción)
    if (filters?.search) {
      // Para búsqueda, necesitamos usar query builder
      const queryBuilder = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.room', 'room')
        .leftJoinAndSelect('room.campus', 'campus')
        .leftJoinAndSelect('event.responsiblePerson', 'responsiblePerson')
        .where('event.isActive = :isActive', { isActive: true });

      // Aplicar búsqueda
      queryBuilder.andWhere(
        '(event.name LIKE :search OR event.description LIKE :search)',
        { search: `%${filters.search}%` }
      );

      // Aplicar otros filtros
      if (filters.roomId) {
        queryBuilder.andWhere('room.id = :roomId', { roomId: filters.roomId });
      }
      if (filters.organizationArea) {
        queryBuilder.andWhere('event.organizationArea = :organizationArea', {
          organizationArea: filters.organizationArea
        });
      }
      if (filters.modality) {
        queryBuilder.andWhere('event.modality = :modality', { modality: filters.modality });
      }
      if (filters.state) {
        queryBuilder.andWhere('event.state = :state', { state: filters.state });
      }

      // Filtro por rango de fechas
      if (filters.startDate && filters.endDate) {
        queryBuilder.andWhere('event.initialDate BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate
        });
      } else if (filters.startDate) {
        queryBuilder.andWhere('event.initialDate >= :startDate', { startDate: filters.startDate });
      } else if (filters.endDate) {
        queryBuilder.andWhere('event.finalDate <= :endDate', { endDate: filters.endDate });
      }

      // Ordenar por capacidad del salón
      if (filters.orderByCapacity) {
        queryBuilder.orderBy('room.capacity', filters.orderByCapacity);
      } else {
        queryBuilder.orderBy('event.createdAt', 'DESC');
      }

      const events = await queryBuilder.getMany();

      return this.transformEvents(events);
    }

    // Si no hay búsqueda, usar find normal con filtros
    // Filtro por rango de fechas
    if (filters?.startDate && filters?.endDate) {
      where.initialDate = Between(filters.startDate, filters.endDate);
    } else if (filters?.startDate) {
      where.initialDate = MoreThanOrEqual(filters.startDate);
    } else if (filters?.endDate) {
      where.finalDate = LessThanOrEqual(filters.endDate);
    }

    // Configurar orden
    let order: any = { createdAt: 'DESC' };
    if (filters?.orderByCapacity) {
      order = { room: { capacity: filters.orderByCapacity } };
    }

    const events = await this.eventRepository.find({
      where,
      relations: ['room', 'room.campus', 'responsiblePerson'],
      order,
    });

    return this.transformEvents(events);
  }

  private transformEvents(events: Event[]) {
    return events.map(event => this.transformEventData(event));
  }

  async findById(id: string): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['room', 'room.campus', 'responsiblePerson'],
    });

    if (!event) return null;

    // Transformar la respuesta para limpiar campos innecesarios
    return this.transformEventData(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['room']
    });
    if (!event) throw new NotFoundException('Event not found');

    const { roomId, responsiblePersonId, maxAttendees, modality, ...eventData } = updateEventDto;

    // Determinar los valores finales para la validación
    const finalMaxAttendees = maxAttendees !== undefined ? maxAttendees : event.maxAttendees;
    const finalModality = modality !== undefined ? modality : event.modality;
    let finalRoom = event.room;

    // Si se actualiza el room, validar que exista
    if (roomId !== undefined) {
      if (roomId === null) {
        // Permitir remover el room solo si es modalidad Virtual
        if (finalModality !== 'Virtual') {
          throw new BadRequestException('Cannot remove room from non-virtual events');
        }
        finalRoom = null;
        event.room = null;
      } else {
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (!room) throw new NotFoundException('Room not found');
        finalRoom = room;
        event.room = room;
      }
    }

    // Validar capacidad si hay un salón asignado
    if (finalRoom) {
      if (finalMaxAttendees > finalRoom.capacity) {
        throw new BadRequestException(
          `The number of attendees (${finalMaxAttendees}) exceeds the room capacity (${finalRoom.capacity}). Please choose a larger room or reduce the number of attendees.`
        );
      }
    }

    // Si se actualiza el responsable, validar que exista
    if (responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({ where: { id: responsiblePersonId } });
      if (!responsiblePerson) throw new NotFoundException('Responsible person not found');
      event.responsiblePerson = responsiblePerson;
    }

    // Actualizar el resto de campos
    if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;
    if (modality !== undefined) event.modality = modality;
    Object.assign(event, eventData);

    const updatedEvent = await this.eventRepository.save(event);

    // Recargar el evento con todas las relaciones para transformarlo
    const fullEvent = await this.eventRepository.findOne({
      where: { id: updatedEvent.id },
      relations: ['room', 'room.campus', 'responsiblePerson'],
    });

    if (!fullEvent) throw new NotFoundException('Event not found after update');

    return this.transformEventData(fullEvent);
  }

  async remove(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    // Marcar el evento como inactivo antes de eliminarlo
    event.isActive = false;
    event.state = 'cancelado';
    await this.eventRepository.save(event);

    return await this.eventRepository.softRemove(event);
  }
}
