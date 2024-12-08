import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {


    @IsString()
    @MinLength(2)
    category: string; 
    
    @IsString()
    url_image: string;

}
