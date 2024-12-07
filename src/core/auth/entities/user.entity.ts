import { Product } from "src/core/products/entities/product.entity"
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"


@Entity({
    schema:'core',
    name:'tp_user'
})
export class User {

    @PrimaryGeneratedColumn()
    id: string 

    @Column('text',{
        unique: true}
    )
    username: string
    
    @Column('text',{select: false})
    password: string

    @Column('integer',{
        default: 2 // 2 = user, 1= admin
    })
    id_type_user: number

    @Column('bool',{
        default: true
    })
    isactive: boolean

    @Column('text',{
        unique: true}
    )
    token_app: string

    @Column('text',{
        unique: true}
    )   
    refreshtoken?: string;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]



    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.username = this.username.trim().toLowerCase()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
}

}
