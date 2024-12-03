import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ProductImage } from '../products/entities/product-image.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>

  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    Logger.log("======== CREANDO CATEGORY ========")
    try {
      const categoryDetail = this.categoryRepository.create({
        ...createCategoryDto,
        id_images: randomUUID()
      });
      await this.categoryRepository.save(categoryDetail);
      await this.productImageRepository.save({url:createCategoryDto.url_image,id_image:categoryDetail.id_images});
    Logger.log("======== CATEGORY CREADA ========")
      return { message: 'Category created successfully' };
    } catch (error) {
      this.logger.error('Error creating category:', error.message);
      this.handleExceptions(error);
    }
    
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
