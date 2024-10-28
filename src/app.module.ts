import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './core/products/entities/product.entity';
import { ProductsModule } from './core/products/products.module';
import { ProductImage } from './core/products/entities/product-image.entity';


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
        entities: [Product,ProductImage],
        synchronize: false,
      }),
    }),
    
    
    
    ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
