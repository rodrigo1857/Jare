import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';



@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
   
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}  


  async create(createProductDto: CreateProductDto) {
    try {
       
        console.log('CreateProductDto:', createProductDto); // Verificar que title está presente
        
        const { images = [], ...productDetail } = createProductDto;

        // Verificar que productDetail incluye title
        console.log('Product Details:', productDetail); 

        const product = this.productRepository.create({
            ...productDetail,
            images: images.map(image => this.productImageRepository.create({ url: image }))
        });

        console.log('Product before save:', product); // Verificar el objeto antes de guardarlo

        await this.productRepository.save(product);
        return { message: 'Product created successfully' };
    } catch (error) {
        this.logger.error('Error creating product:', error.message); // Más información de depuración
        this.handleExceptions(error);
    }
}



  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
