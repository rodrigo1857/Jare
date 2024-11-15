import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Logger, Res, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
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
    Logger.log('===== OBTENER ARCHIVO === ');
    const path = this.filesService.getStaticProductImage(imageName);
    //  res.status(403).json({
    //   ok:false,
    //   path:path
    //  })
    //  return path

    res.sendFile(path);
  }


  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    //limits:{fileSize: 1024*1024*5},
    storage:diskStorage({
      destination:'./static/products',
      filename: fileNamer
    })
  }))
  uploadProducImage(@UploadedFile()file: Express.Multer.File,@Req() req){
    Logger.log('===== CARGANDO EL ARCHIVO=== ');
    if (req['fileValidationError']) {
      throw new BadRequestException(req['fileValidationError']);
    }

    if (!file) {
      throw new BadRequestException('Make sure that file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;
    return {
      secureUrl,
    };
  }

}
