import { Column, Entity, PrimaryColumn } from "typeorm";

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
  
    // TODO: implementar la parte de tablas relacionales
    idorder: number;
    idproduct: number;

}