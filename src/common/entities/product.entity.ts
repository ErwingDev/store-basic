import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('products', { schema: 'public' })
export class products {

    @PrimaryColumn({
        type: 'integer',
        name: 'idproduct'
    })
    idorder: number;

    @Column({
        type: 'char varying',
        name: 'name',
        nullable: false,
        length: 20
    })
    name: string;

    @Column({
        type: 'text',
        name: 'description',
    })
    description: string;

    @Column({ 
        type: 'numeric', 
        name: 'price', 
        precision: 5, 
        scale: 2, 
    })
    price: number;

    @Column({ 
        type: 'integer', 
        name: 'stock',
        nullable: false 
    })
    stock: number;

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

    @Column({
        type: 'boolean',
        name: 'removed',
        nullable: false,
        default: false
    })
    removed: boolean;

    idcategory: number;

}