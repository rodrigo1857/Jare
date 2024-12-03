import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ProductImage } from '../products/entities/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,ProductImage])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
