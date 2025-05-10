import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./oder.entity";
import { Products } from "./product.entity";

@Entity('order_items', { schema: 'public' })
export class OrderItems {

    @PrimaryColumn({
        type: 'integer',
        name: 'idorder_item'
    })
    idorderItem: number;

    @Column({ 
        type: 'integer', 
        name: 'quantity',
        nullable: false 
    })
    quantity: number;
  
    @Column({ 
        type: 'numeric', 
        name: 'unit_price',
        precision: 10, 
        scale: 2
    })
    unitPrice: string;
  
    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'idorder' })
    order: Order;

    @ManyToOne(() => Products, (product) => product.orderItems)
    @JoinColumn({ name: 'idproduct' })
    product: Products;

}