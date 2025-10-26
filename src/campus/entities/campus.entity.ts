import { Room } from "src/room/entities/room.entity";
import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('campuses')
export class Campus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 'abierto' })
    state: string;

    @OneToMany(() => Room, (room) => room.campus)
    rooms: Room[];

    @Column( { default: true } )
    isActive: boolean;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    hashedRefreshToken?: string;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
    
    @BeforeSoftRemove()
    deactivateBeforeSoftRemove() {
        this.isActive = false;
    }


}
