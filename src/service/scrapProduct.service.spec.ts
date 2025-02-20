import { Test, TestingModule } from '@nestjs/testing';
import { ScrapProductService } from './scrapProduct.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';

describe('ScrapProductService', () => {
  let service: ScrapProductService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapProductService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScrapProductService>(ScrapProductService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return cached data if it exists', async () => {
    const url = 'https://example.com/product';
    const cachedData = {
      title: 'Cached Product',
      image: 'https://example.com/image.jpg',
      price: '100.00',
      description: 'Cached Description',
      url: url,
    };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedData);

    const result = await service.scrapProduct(url);
    expect(result).toEqual(cachedData);
  });

  it('should fetch new data if not in cache', async () => {
    const url = 'https://example.com/product';
    const newData = {
      title: 'New Product',
      image: 'https://example.com/image.jpg',
      price: '100.00',
      description: 'New Description',
      url: url,
    };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    const spyFetch = jest
      .spyOn(service as any, 'fetchProductData')
      .mockResolvedValue(newData);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    const result = await service.scrapProduct(url);
    expect(result).toEqual(newData);
    expect(cacheManager.set).toHaveBeenCalledWith(url, newData, 360000);
    spyFetch.mockRestore();
  });

  it('should throw an error if fetchProductData fails', async () => {
    const url = 'https://example.com/product';
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    const spyFetch = jest
      .spyOn(service as any, 'fetchProductData')
      .mockRejectedValueOnce(new Error('URL parameter is required'));

    await expect(service.scrapProduct(url)).rejects.toThrow('Fetch failed');
    spyFetch.mockRestore();
  });
});
