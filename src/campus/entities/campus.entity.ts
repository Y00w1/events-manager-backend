import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('campuses')
export class Campus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( { default: true } )
    isActive: boolean;

    @Column( { default: true } )
    name: string;
    
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
