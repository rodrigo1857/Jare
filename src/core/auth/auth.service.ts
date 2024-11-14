import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './entities/interface';
import { LoginUserDto } from './dto/login-user.dto';
@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const {password, ...userData} = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10)
      }
        );
      console.log(user);
      await this.userRepository.save(user); 
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({id:user.id})
      };
    } catch (error) {
      this.HandleError(error)
    }
    
  }


  async login(loginUserDto: LoginUserDto) {

    const {username,password} = loginUserDto;
    const user = await this.userRepository.findOne({
      where:{username},
      select:{username:true,password:true, id:true}
    });

    if(!user){
      throw new UnauthorizedException('Usuario no encontrado ')
    }

    if(!bcrypt.compareSync(password,user.password))
      throw new UnauthorizedException('Credenciales no son correctas por la contraseña')
    
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    };
 
}
  
  private getJwtToken(payload:JwtPayload){  
    const token = this.jwtService.sign(payload);
    console.log(token);
    return token;

  }

  private HandleError(error:any): never{
    console.log(error);
    if(error.code = '23505'){
      throw new BadRequestException(error.detail)      
  }
  throw new InternalServerErrorException('Error inesperado') 
  }


   checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    }
}

}
