import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  schema:'core',
  name:'tm_type_products'})
export class ProductCategory{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    category: string ;

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