import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ScrapProductModule } from '../src/scrapProduct.module';

interface ScrapResult {
  url: string;
  title: string;
  price: string;
  image: string;
  description: string;
}

describe('ScrapProductController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScrapProductModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/scrap-product (POST)', async () => {
    const testUrl =
      'https://www.pontofrio.com.br/Eletroportateis/FerrodePassar/ferro-a-vapor-black-decker-fx100-com-spray-branco-roxo-14995462.html';
    const response = await request(app.getHttpServer())
      .post('/scrap-product')
      .send({ url: testUrl })
      .expect(201);

    const responseBody: ScrapResult = response.body as ScrapResult;

    expect(responseBody).toEqual({
      url: testUrl,
      title: expect.any(String) as string,
      price: expect.any(String) as string,
      image: expect.any(String) as string,
      description: expect.any(String) as string,
    });
  }, 10000); // Increase timeout to 10000 ms
});
