import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {

    @IsString()
    username:string;
    

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}