import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { Order } from "./oder.entity";

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
    
    @Exclude()
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
        length: 10
    })
    phone: string;
    
    @Column({
        type: 'character varying',
        name: 'image',
        default: 'default.png'
    })
    image: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at' 
    })
    createdAt: Date;
    
    @Column({
        type: 'boolean',
        name: 'status',
        default: true
    })
    status: boolean;

    @OneToMany(() => Order, (order) => order.client)
    order: Order[];

    @Expose()
    get pathImage(): string {
        return `${process.env.HOST_UPLOAD}/clients/${this.image}`;
    }

}