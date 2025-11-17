import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ENROLLMENT_STATUS } from "../constant/enrollment.constant";
import { Event } from "src/event/entities/event.entity";

@Entity('enrollments')
export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Event, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Event;

    @Column({ type: 'enum', enum: ENROLLMENT_STATUS, default: ENROLLMENT_STATUS.ENROLLED })
    status: string;

    @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
    enrollmentDate: Date;

    @Column({
    type: 'timestamp',
    nullable: true,
  })
  cancelledAt?: Date; 
}
