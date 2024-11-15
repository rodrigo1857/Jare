import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './entities/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [AuthController,],
  providers: [AuthService,JwtStrategy],
  imports: [ ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
     
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (ConfigService:ConfigService) => {
        //console.log('JWT SECRET-Config-service', ConfigService.get('JWT_SECRET')) 
        // console.log('JWT SECRET-Variables-entorno', process.env.JWT_SECRET)
        return {
          secret: ConfigService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })],
    exports: [AuthService, TypeOrmModule, JwtModule,PassportModule,JwtModule]
})
export class AuthModule {}
