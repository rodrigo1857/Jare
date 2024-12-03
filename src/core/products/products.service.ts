import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { PaginationDTO } from 'src/common/utils/pagination.dto';
import { Category } from '../category/entities/category.entity';
import { randomUUID } from 'crypto';



@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
   
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly dataSource: DataSource,
  ) {}  

  async create(createProductDto: CreateProductDto) {
    Logger.log("======== CREANDO PRODUCTO ========")
    try {
        const { images = [], category, title, ...productDetail } = createProductDto;

        // Busca la categoría
        const productCategory = await this.categoryRepository.findOne({
            where: { category: category }
        });

        // Verifica si la categoría existe
        if (!productCategory) {
            throw new BadRequestException('Product category does not exist.');
        }

        
        // Crea el producto
        const id_images = randomUUID();
        const product = this.productRepository.create({
            ...productDetail,
            title: (title.toLocaleLowerCase().replaceAll(" ","-")),
            id_type_product: productCategory.id,
            id_images: id_images,
            images: images.map(image => this.productImageRepository.create({ url: image, id_image: id_images }))
        });
        await this.productRepository.save(product);
        Logger.log("======== PRODUCTO CREADO ========")
        return { message: 'Product created successfully' };
    } catch (error) {
        this.logger.error('Error creating product:', error.message);
        this.handleExceptions(error);
    }
}



  async findAll(paginationDTO: PaginationDTO) {
    Logger.log("======== OBTENIENDO PRODUCTOS ========")
    const{limit = 10 , offset = 0} = paginationDTO;
    const products = await this.productRepository.find({
      take : limit,
      skip : offset,
      relations : {
        images:true,
      }
    });
    
    const productsWithCategories = await Promise.all(
      products.map(async (product) => {
        const productCategory = await this.categoryRepository.findOne({
          where: { id: product.id_type_product },
        });
        return {
          ...product,
          category: productCategory,
        };
      })
    );
  
    return productsWithCategories.map(({ images, category, ...rest }) => ({
      ...rest,
      category,
      images: images.map((image) => image.url),
    }));
  }
  
  async findOne(id: string): Promise<Product> {
  let product: Product;
  Logger.log("======== BUSCANDO PRODUCTO ========")
  product = await this.productRepository.findOneBy({ title: id.toLowerCase() });
  if (!product)
    throw new NotFoundException(`Productor with id ${id} not found`)
    return product
  }

  async finOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    Logger.log("======== PRODUCTO ENCONTRADO ========")
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async update(title: string, updateProductDto: UpdateProductDto) {
  Logger.log("======== ACTUALIZANDO PRODUCTO ========")
   const { images = [],...toUpdate } = updateProductDto;
   const product = await this.productRepository.findOneBy({ title: title.toLowerCase() });   
   const updateProduct = await this.productRepository.preload({id:product.id, ...toUpdate});
   if (!updateProduct) throw new NotFoundException(`No se encontro el producto`);
  
    // Create queryRunner 
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { id_image: updateProduct.id_images });
        updateProduct.images = images.map(
          image => this.productImageRepository.create({ url: image }))
      }
      // await this.productRepository.save(product);
      await queryRunner.manager.save(updateProduct);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      Logger.log("======== PRODUCTO ACTUALIZADO ========")
      return this.finOnePlain(title);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }

 
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    Logger.log("======== PRODUCTO ELIMINADO ========")
    return { message: 'Product deleted successfully' };
  }


  private handleExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }
}
