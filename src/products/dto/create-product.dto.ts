import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
export class CreateProductDto {

    
    @IsString()
    title: string;
     
    
    @IsString()
    @IsOptional()
    description?: string;
    
    @IsNumber()
    @IsOptional()
    price?: number;
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;
    
    
    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    sizes: number[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

}
