import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Logger, Res, Req, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter ,fileNamer} from './helpers/index';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string){
    Logger.log('======== OBTENER ARCHIVO ======== ');
    const path = this.filesService.getStaticProductImage(imageName);
    Logger.log('======== ARCHIVO ENCONTRADO ======== ');
    res.sendFile(path);
  }


  @Post('product')
  @UseInterceptors(FilesInterceptor('images',5,{
    
    fileFilter: fileFilter,
    //limits:{fileSize: 1024*1024*5},
    storage:diskStorage({
      destination:'./static/products',
      filename: fileNamer
    }),
  }))
  uploadProducImage(@UploadedFiles()images: Express.Multer.File[],@Req() req){
    Logger.log('======== CARGANDO EL ARCHIVO ========');
    if (req['fileValidationError']) {
      throw new BadRequestException(req['fileValidationError']);
    }

    
    if (!images) {
   throw new BadRequestException('Make sure that file is an image');
    }
    
    const secureUrl = [];
    images.forEach(image => {
      console.log((image.originalname));
      secureUrl.push(`${this.configService.get('HOST_API')}/files/product/${image.filename}`);
    }); 
    Logger.log(" ======== ARCHIVO CARGADO ========")
    

    return {
      urls:secureUrl
    };
  }

}
