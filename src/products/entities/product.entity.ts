import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ schema: 'core',
          name: 'tp_products' })
export class Product {


    @PrimaryGeneratedColumn()
    id: number;


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



    //relaciones
    /*  @OneToMany(
         () => ProductImage,
         (productImage) => productImage.product,
         { cascade: true,eager:true}
     )
     images?: ProductImage[];
 
 
     @ManyToOne(
         () => User,
         (user) => user.product,
         {eager:true}
     )
     user:User;
 
 
     @BeforeInsert()
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

