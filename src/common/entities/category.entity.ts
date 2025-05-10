import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Products } from "./product.entity";

@Entity('categories', { schema: 'public' })
export class Category {

    @PrimaryColumn({
        type: 'integer',
        name: 'idcategory'
    })
    idcategory: number;

    @Column({
        type: 'character varying',
        name: 'name',
        nullable: false
    })
    name: string;
    
    @Column({
        type: 'text',
        name: 'description',
    })
    description: string;
    
    @Column({
        type: 'boolean',
        name: 'status',
        nullable: false,
        default: true
    })
    status: boolean;

    @OneToMany(() => Products, (product) => product.category)
    products: Products[];

}