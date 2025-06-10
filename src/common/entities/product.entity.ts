import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Category } from "./category.entity";
import { OrderItems } from "./order-items.entity";
import { Expose } from "class-transformer";

@Entity('products', { schema: 'public' })
export class Products {

    @PrimaryColumn({
        type: 'integer',
        name: 'idproduct'
    })
    idproduct: number;

    @Column({
        type: 'character varying',
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
        type: 'character varying',
        name: 'image',
        nullable: false,
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
        nullable: false,
        default: true
    })
    status: boolean;

    // 1 producto pertenece a 1 categoria / 1 categoria puede tener muchos productos
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'idcategory' })
    category: Category;

    // 1 producto puede estar en muchas ordenes
    @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
    orderItems: OrderItems[];

    @Expose()
    get pathImage(): string {
        return `${process.env.HOST_UPLOAD}/products/${this.image}`;
    }

}