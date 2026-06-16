import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../enums/user-roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ default: UserRoles.USER, nullable: false })
    role: UserRoles;

    @Column({ nullable: false, select: false })
    password: string;
}
