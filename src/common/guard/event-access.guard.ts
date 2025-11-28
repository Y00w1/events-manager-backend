import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class EventAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) return false;

    const roles: string[] = (user.roles as string[]) ?? (user.role ? [user.role] : []);

    // Admins can access any event
    if (roles.includes('admin')) return true;

    // Organizers can access only events they are responsible for
    if (roles.includes('organizer')) {
      const eventId = req.params?.eventId;
      if (!eventId) return false;

      const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['responsiblePerson'] });
      if (!event) throw new ForbiddenException('Event not found'); //TODO: Custom Exception

      const responsibleId = event.responsiblePerson?.id;
      if (!responsibleId) throw new ForbiddenException('Event has no responsible person'); //TODO: Custom Exception

      if (responsibleId === user.sub) return true;
      throw new ForbiddenException('Organizer does not own this event'); //TODO: Custom Exception
    }

    // All other roles denied
    throw new ForbiddenException('Access denied'); //TODO: Custom Exception
  }
}
