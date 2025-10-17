import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/role.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    role: Role;

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
