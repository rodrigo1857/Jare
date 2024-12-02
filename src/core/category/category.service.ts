import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryDetail = this.categoryRepository.create({
        ...createCategoryDto,
        id_images: randomUUID()
      });
      await this.categoryRepository.save(categoryDetail);
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
