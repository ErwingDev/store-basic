import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { Role } from "../enums/role.enum";

@Entity('users', { schema: 'public' })
export class Users {

    @PrimaryColumn({
        type: 'integer',
        name: 'iduser'
    })
    iduser: number;

    @Column({
        type: 'character varying',
        name: 'email',
        nullable: false,
        unique: true
    })
    email: string;
    
    @Column({
        type: 'character varying',
        name: 'password',
        nullable: false
    })
    password: string;
    
    @Column({
        type: 'character varying',
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'character varying',
        name: 'surname',
        nullable: false,
    })
    surname: string;

    @Column({
        type: 'character varying',
        name: 'status',
    })
    role: Role;
    
    @Column({
        type: 'character varying',
        name: 'phone',
        nullable: false,
        length: 10
    })
    phone: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at' 
    })
    createdAt: Date;
    
    @Column({
        type: 'boolean',
        name: 'status',
        nullable: false,
        default: true
    })
    status: boolean;

}