import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { OrderStatus } from "../enums/order.enum";

@Entity('orders', { schema: 'public' })
export class Order {

    @PrimaryColumn({
        type: 'integer',
        name: 'idorder'
    })
    idorder: number;

    @Column({
        type: 'char varying',
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
        type: 'char varying', 
        name: 'shipping_address',
        nullable: false,
        length: 50
    })
    shippingAddress: string;
  
    @CreateDateColumn({ 
        name: 'created_at' 
    })
    createdAt: Date;

    // TODO: implementar la parte de tablas relacionales
    idclient: number;

}