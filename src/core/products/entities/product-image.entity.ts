import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  schema:'core',
  name:'ts_products_images'})
export class ProductImage{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string ;

    @ManyToOne(
        () => Product,
        (product)=> product.images,
        {
          onDelete:'CASCADE'  
        }
    )
    @JoinColumn({ name: 'id_product' }) 
    id_product: Product

}