import { BeforeSoftRemove, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enum/role.enum";
import { Exclude } from "class-transformer";
import { OrganizationArea } from "src/event/enum/organizationArea.enum";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    documentNumber: string;

    @Column()
    role: Role;

    @Column({ default: true })
    @Exclude()
    isActive: boolean;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    @Exclude()
    createdAt: Date;

    @Column({ type: 'varchar', nullable: true })
    @Exclude()
    hashedRefreshToken: string | null;

    @DeleteDateColumn({ nullable: true })
    @Exclude()
    deletedAt?: Date;

    @Column({ type: 'enum', enum: OrganizationArea })
    organizationArea: OrganizationArea;

    @BeforeSoftRemove()
    deactivateBeforeSoftRemove() {
        this.isActive = false;
    }
}
