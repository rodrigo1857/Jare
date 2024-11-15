import { BeforeInsert, Column, Entity, Generated, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity({ schema: 'core',
          name: 'tp_products' })
export class Product {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;


    @Column('float', {
        default: 0
    })
    price: number;


    @Column({
        type: 'text',
        nullable: true
    })
    description: string;



    @Column('int', {
        default: 0
    })
    stock: number;


    @Column('text', {
        array: true
    })
    sizes: number[];


    @Column('text')
    gender: string;

    @Column({ type: 'int' })
    id_type_product: number;

    @Column()
    @Generated('uuid')
    id_images: string;


    //relaciones
     @OneToMany(
         () => ProductImage,
         (productImage) => productImage.id_product,
         { cascade: true,eager:true}
     )
     images?: ProductImage[];

    //  @ManyToOne(
    //      () => User,
    //      (user) => user.product,
    //      {eager:true}
    //  )
    //  user:User;
 
 
    /*  @BeforeInsert()
     checkSlugInsert() {
         if (!this.slug) {
             this.slug = this.title;
         }
 
         this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", "")
     }
 
     @BeforeUpdate()
     slugUpdate() {
         this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", "")
     } */
}


