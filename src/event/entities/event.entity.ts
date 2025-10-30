import { Room } from "src/room/entities/room.entity";
import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrganizationArea } from "../enum/organizationArea.enum";
import { User } from "src/user/entities/user.entity";
import { Modality } from "../enum/modality.enum";

@Entity('events')
export class Event {
     @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column()
        name: string;

        @Column()
        initialDate: Date;

        @Column()
        finalDate: Date;
    
        @Column({ type: 'time', nullable: true })
        beginHour: String;

        @Column({ type: 'time', nullable: true })
        endHour: String;

        @ManyToOne(() => Room, (room) => room.events, { onDelete: 'CASCADE', eager: true, nullable: true })
        room: Room | null;

        @Column({ type: 'enum', enum: OrganizationArea })
        organizationArea: OrganizationArea;

        @Column()
        description: string;

        @Column() 
        state: string;

        @ManyToOne(() => User, { eager: true, nullable: true })
        responsiblePerson: User | null;

        @Column({ type: 'enum', enum: Modality })
        modality: Modality;

        @Column()
        maxAttendees: number;

        @Column()
        urlImage: string;

        @Column({ default: true })
        isActive: boolean;

        @Column({ default: () => 'CURRENT_TIMESTAMP' })
        createdAt: Date;
    
        @DeleteDateColumn({ nullable: true })
        deletedAt?: Date;
        
        @BeforeSoftRemove()
        deactivateBeforeSoftRemove() {
            this.isActive = false;
        }
}
