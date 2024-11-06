import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { ProductCategory } from './entities/product-category.entity';



@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
   
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}  

  async create(createProductDto: CreateProductDto) {
    try {
        const { images = [], category, title, ...productDetail } = createProductDto;

        // Busca la categoría
        const productCategory = await this.productCategoryRepository.findOne({
            where: { category: category }
        });

        // Verifica si la categoría existe
        if (!productCategory) {
            throw new BadRequestException('Product category does not exist.');
        }

        

        // Crea el producto
        const product = this.productRepository.create({
            ...productDetail,
            title: title.replaceAll(" ","-"),
            id_type_product: productCategory.id , 
            images: images.map(image => this.productImageRepository.create({ url: image }))
        });

        console.log('Product before save:', product); 

        await this.productRepository.save(product);
        return { message: 'Product created successfully' };
    } catch (error) {
        this.logger.error('Error creating product:', error.message);
        this.handleExceptions(error);
    }
}



  findAll() {
    const products = this.productRepository.find();
    return products;
  }
  
  async findOne(id: string): Promise<Product> {
  let product: Product;
  product = await this.productRepository.findOneBy({ title: id.toLowerCase() });
  if (!product)
    throw new NotFoundException(`Productor with id ${id} not found`)
    return  product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
