import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ProductImage } from '../products/entities/product-image.entity';
import { url } from 'inspector';

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
      const category = await this.categoryRepository.save({
        ...categoryDetail,
        url: createCategoryDto.url_image
      });
      await this.productImageRepository.save({url:createCategoryDto.url_image,id_image:categoryDetail.id_images});
    Logger.log("======== CATEGORY CREADA ========")
      return { category, url };
    } catch (error) {
      this.logger.error('Error creating category:', error.message);
      this.handleExceptions(error);
    }
    
  }

  async findAll() {
    const [categories, total] = await this.categoryRepository.findAndCount();
    return { total,categories };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
  
    const product = await this.productImageRepository.findOne({ where: { id_image: category.id_images } });  
  
    return {
      ...category,
      product:product.url
    };
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    Logger.log("======== ELIMINANDO CATEGORIA========")
    try {
      const product = await this.findOne(id);
      await this.categoryRepository.delete(id);
      await this.productImageRepository.delete({id_image:product.id_images});
      Logger.log("======== CATEGORIA ELIMINADA ========")
      return `This action removes a #${id} category`;
    } catch (error) {
      this.logger.error('Error removing category:', error.message);
      this.handleExceptions(error);
    }
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
