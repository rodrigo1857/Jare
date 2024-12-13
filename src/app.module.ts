import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './core/products/entities/product.entity';
import { ProductsModule } from './core/products/products.module';
import { ProductImage } from './core/products/entities/product-image.entity';
import { FilesModule } from './files/files.module';
import { AuthModule } from './core/auth/auth.module';
import { User } from './core/auth/entities/user.entity';
import { CategoryModule } from './core/category/category.module';
import { Category } from './core/category/entities/category.entity';



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
        entities: [Product,ProductImage,Category,User],
        synchronize: false,
      }),
    }),
    ProductsModule,
    AuthModule,
    FilesModule,CategoryModule]

})
export class AppModule {}
