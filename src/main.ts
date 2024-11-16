import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableCors({origin: 'http://127.0.0.1:5500',
    credentials: true,});
  
  app.setGlobalPrefix('joyeria');

  app.useGlobalPipes(
    
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

  await app.listen(process.env.PORT || 3000);

  Logger.log('======== API STORE CORRRIENDO ========')
}
bootstrap();
