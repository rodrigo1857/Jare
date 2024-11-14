import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController,],
  providers: [AuthService],
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
            expiresIn: '1h'
          }
        }
      }
    })],
    exports: [AuthService, TypeOrmModule, JwtModule,PassportModule,JwtModule]
})
export class AuthModule {}
