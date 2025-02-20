import { Test, TestingModule } from '@nestjs/testing';
import { ScrapProductController } from './scrapProduct.controller';
import { ScrapProductService } from '../service/scrapProduct.service';

describe('AppController', () => {
  let appController: ScrapProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScrapProductController],
      providers: [ScrapProductService],
    }).compile();

    appController = app.get<ScrapProductController>(ScrapProductController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
