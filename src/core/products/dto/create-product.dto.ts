import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
export class CreateProductDto {

    
    @IsString()
    @MinLength(1)
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

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
