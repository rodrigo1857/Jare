import { Product } from "src/core/products/entities/product.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema:'core',
    name:'tm_type_products'})
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{
        unique:true,
    })
    category: string ;

    @Column('text')
    id_images: string;

    //relaciones
    @OneToOne(
        () => Product,
        (product)=> product.id_type_product,
        {
          onDelete:'CASCADE'  
        }
    )
    product: Product
}
