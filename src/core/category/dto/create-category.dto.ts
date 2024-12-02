import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsNumber()
    id: number;

    @IsString()
    @MinLength(2)
    category: string; 
    
    @IsString()
    url_image: string;

}
