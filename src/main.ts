import { NestFactory } from '@nestjs/core';
import { ScrapProductModule } from './scrapProduct.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ScrapProductModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Scrap Product API')
    .setDescription('API for scraping product data')
    .setVersion('1.0')
    .addTag('scrap-product')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle bootstrap errors
bootstrap().catch((error) => {
  console.error('Failed to bootstrap application:', error);
  process.exit(1);
});
