import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
  schema:'core',
  name:'ts_images'})
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
    @JoinColumn({ name: 'id_image' , referencedColumnName: 'id_images' }) // referenciar a otra columna que no sea la llave primaria 
    id_image: string;

    // @ManyToOne(
    //     () => Product,
    //     (product)=> product.images,
    //     {
    //       onDelete:'CASCADE'  
    //     }
    // )
    // @JoinColumn({ name: 'id_image' , referencedColumnName: 'id_images' }) // referenciar a otra columna que no sea la llave primaria 
    // id_image: Product

}