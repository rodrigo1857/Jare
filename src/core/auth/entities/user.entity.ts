import { Product } from "src/core/products/entities/product.entity"
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"


@Entity('User')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string 

    @Column('text',{
        unique: true}
    )
    email: string
    
    @Column('text',{select: false})
    password: string

    @Column('text')
    fullName: string

    @Column('bool',{
        default: true
    })
    isActive: boolean

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    // @OneToMany(
    //     ()=> Product,(product) => product.user
    // )
    // product:Product;


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.trim().toLowerCase()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
}

}
