import { Campus } from "src/campus/entities/campus.entity";
import { Event } from "src/event/entities/event.entity";
import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
        id: string;
    
        @Column( { default: true } )
        type: string;

        @Column({ type: 'int', default: 0 })
        capacity: number;

        @Column({ default: 'disponible' })
        state: string;

        @Column({ type: 'json', nullable: true })
        equipment: string[];

        @ManyToOne(() => Campus, (campus) => campus.rooms, { onDelete: 'CASCADE', eager: true })
        campus: Campus;

        @OneToMany(() => Event, (event) => event.room)
        events: Event[];

        @Column( { default: true } )
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
