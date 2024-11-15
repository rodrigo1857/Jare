import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        super({
           secretOrKey:configService.get('JWT_SECRET'),
           jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
           
    });
    }

    async validate(payload: JwtPayload):Promise<any>{

        const{id} = payload;
        const user = await this.userRepository.findOneBy({id});
        if(!user)
        throw new UnauthorizedException('Token no es valido')

        if(!user.isactive)
        throw new UnauthorizedException('Usuario no activo')
        
        return user;
    }
}