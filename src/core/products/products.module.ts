import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductImage } from './entities/product-image.entity';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { Category } from '../category/entities/category.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    TypeOrmModule.forFeature([Product,ProductImage,Category]),AuthModule,CategoryModule
  ],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
