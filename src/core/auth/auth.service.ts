import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './entities/interface';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}
  async create(createAuthDto: CreateAuthDto) {
    Logger.log('======== CREANDO USUARIO ========')
    try {
      const {password,username,usertype} = createAuthDto;

      const user = this.userRepository.create({
        username,
        roles: usertype?[usertype]:['user'],
        id_type_user: usertype =='admin'? 1:2,
        password: bcrypt.hashSync(password,10)
      }
        );

      user.token_app = this.getJwtToken({ id: user.id });
      user.refreshtoken = this.getRefreshToken({ id: user.id });
    
      await this.userRepository.save(user); 
      delete user.password;
    Logger.log('======== USUARIO CREADO ========')
      return {
        ...user
      };
      
    } catch (error) {
      this.HandleError(error)
    }
    
  }


  async login(loginUserDto: LoginUserDto) {

    Logger.log('======== LOGIN USUARIO ========')
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
    
    const refreshToken = this.getRefreshToken({ id: user.id });
    user.token_app = this.getJwtToken({ id: user.id });
    user.refreshtoken = refreshToken;
    
    await this.userRepository.update(user.id, {
      refreshtoken: user.refreshtoken,
      token_app: user.token_app,
    });
    Logger.log('======== ACCESO EXITOSO ========')
    return {
      token: this.getJwtToken({id:user.id}),
      refreshToken,
    };
 
}
  
  private getJwtToken(payload:JwtPayload){  
    const token = this.jwtService.sign(payload);
        return token;

  }

  private getRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '20d' });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });

      if (!user || user.refreshtoken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        token: this.getJwtToken({ id: user.id }),
        refreshToken: this.getRefreshToken({ id: user.id }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private HandleError(error:any): never{
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
