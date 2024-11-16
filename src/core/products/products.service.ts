import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { ProductCategory } from './entities/product-category.entity';
import { PaginationDTO } from 'src/common/utils/pagination.dto';



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
            title: (title.toLocaleLowerCase().replaceAll(" ","-")),
            id_type_product: productCategory.id , 
            images: images.map(image => this.productImageRepository.create({ url: image })),
            
        });

        await this.productRepository.save(product);
        return { message: 'Product created successfully' };
    } catch (error) {
        this.logger.error('Error creating product:', error.message);
        this.handleExceptions(error);
    }
}



  async findAll(paginationDTO: PaginationDTO) {
    const{limit = 10 , offset = 0} = paginationDTO;
    const products = await this.productRepository.find({
      take : limit,
      skip : offset,
      relations : {
        images:true,
      }
    });
    
    return products.map(({images,...rest})=>({
      ...rest,
      images:images.map(image=>image.url)
    }));
  }
  
  async findOne(id: string): Promise<Product> {
  let product: Product;
  product = await this.productRepository.findOneBy({ title: id.toLowerCase() });
  if (!product)
    throw new NotFoundException(`Productor with id ${id} not found`)
    return product
  }

  async finOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
   const { images = [],...toUpdate } = updateProductDto;
   const product = await this.productRepository.findOneBy({ title: id.toLowerCase() });

   
   const updateProduct = await this.productRepository.preload({id:product.id, ...toUpdate});
 
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
