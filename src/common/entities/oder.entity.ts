import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order.enum";
import { OrderItems } from "./order-items.entity";
import { Clients } from "./client.entity";

@Entity('orders', { schema: 'public' })
export class Order {

    /* @PrimaryColumn({
        type: 'integer',
        name: 'idorder'
    }) */
    @PrimaryGeneratedColumn({
        type: 'integer', 
        name: 'idorder'
    })
    idorder: number;

    @Column({
        type: 'character varying',
        name: 'status',
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({ 
        type: 'numeric', 
        name: 'total', 
        precision: 5, 
        scale: 2, 
    })
    total: number;
  
    @Column({ 
        type: 'character varying', 
        name: 'shipping_address',
        nullable: false,
        length: 50
    })
    shippingAddress: string;
  
    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at' 
    })
    createdAt: Date;

    @ManyToOne(() => Clients, (client) => client.order)
    @JoinColumn({ name: 'idclient' })
    client: Clients;

    @OneToMany(() => OrderItems, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItems[]

}