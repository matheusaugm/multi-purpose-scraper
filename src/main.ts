import { NestFactory } from '@nestjs/core';
import { ScrapProductModule } from './scrapProduct.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ScrapProductModule);

  const config = new DocumentBuilder()
    .setTitle('Scrap Product API')
    .setDescription('API for scraping product data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
