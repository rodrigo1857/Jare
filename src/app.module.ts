import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';


@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }
    ),
    
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: 
      (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: false,
        entities: [Product],
        synchronize: false,
      }),
    }),
    
    
    
    ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
