import { Test, TestingModule } from '@nestjs/testing';
import { ScrapProductController } from './scrapProduct.controller';
import { ScrapProductService } from '../service/scrapProduct.service';

describe('ScrapProductController', () => {
  let controller: ScrapProductController;
  let mockScrapProductService: ScrapProductService;

  const mockScrapResult: ScrapResult = {
    url: 'https://test.com/product',
    title: 'Test Product',
    price: 'R$ 99,99',
    image: 'https://test.com/image.jpg',
    description: 'Test product description',
  };

  beforeEach(async () => {
    const mockService = {
      scrapProduct: jest.fn().mockResolvedValue(mockScrapResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapProductController],
      providers: [
        {
          provide: ScrapProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ScrapProductController>(ScrapProductController);
    mockScrapProductService =
      module.get<ScrapProductService>(ScrapProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('scrapProduct', () => {
    const testUrl = 'magazineluiza.com.br/product';

    it('should call scrapProduct service method', async () => {
      const scrapProductSpy = jest.spyOn(
        mockScrapProductService,
        'scrapProduct',
      );
      await controller.scrapProduct(testUrl);
      expect(scrapProductSpy).toHaveBeenCalledWith(testUrl);
    });

    it('should return scraping result', async () => {
      const result = await controller.scrapProduct(testUrl);
      expect(result).toEqual(mockScrapResult);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Scraping failed');
      jest
        .spyOn(mockScrapProductService, 'scrapProduct')
        .mockRejectedValueOnce(error);

      await expect(controller.scrapProduct(testUrl)).rejects.toThrow(error);
    });
  });
});
