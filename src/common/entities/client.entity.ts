import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('clients', { schema: 'public' })
export class Clients {

    @PrimaryColumn({
        type: 'integer',
        name: 'idclient'
    })
    idclient: number;

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
        name: 'address',
    })
    address: string;
    
    @Column({
        type: 'character varying',
        name: 'phone',
        nullable: false,
        length: 10
    })
    phone: string;
    
    @Column({
        type: 'char varying',
        name: 'image',
        nullable: false,
        default: 'default.png'
    })
    image: string;

    @CreateDateColumn({ 
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