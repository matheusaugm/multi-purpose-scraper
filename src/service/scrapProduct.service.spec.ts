import { Test, TestingModule } from '@nestjs/testing';
import { ScrapProductService } from './scrapProduct.service';
import { CacheService } from './cacheService.service';
import { SCRAPER_TOKEN } from '../constants/tokens';
import { Scraper } from '../interfaces/scraper.interface';
import { ScrapProductDto } from '../dto/scrapProduct.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ScrapProductService', () => {
  let service: ScrapProductService;
  let cacheService: CacheService;
  let scraper: Scraper;

  const mockProductData = new ScrapProductDto(
    'https://www.test.com/product',
    'Test Product',
    'http://test.com/image.jpg',
    'R$ 99,99',
    'Test Description',
  );

  const mockCacheService = {
    getScrapResult: jest.fn(),
    setScrapResult: jest.fn(),
  };

  const mockScraper = {
    extractWebsiteData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapProductService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: SCRAPER_TOKEN,
          useValue: mockScraper,
        },
      ],
    }).compile();

    service = module.get<ScrapProductService>(ScrapProductService);
    cacheService = module.get<CacheService>(CacheService);
    scraper = module.get<Scraper>(SCRAPER_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached results if available', async () => {
    mockCacheService.getScrapResult.mockResolvedValue(mockProductData);

    const result = await service.scrapProduct('https://www.test.com/product');

    expect(result).toEqual(mockProductData);
    expect(mockCacheService.getScrapResult).toHaveBeenCalledWith(
      'https://www.test.com/product',
    );
    expect(mockScraper.extractWebsiteData).not.toHaveBeenCalled();
  });

  it('should scrape and cache new results if not cached', async () => {
    mockCacheService.getScrapResult.mockResolvedValue(null);
    mockScraper.extractWebsiteData.mockResolvedValue(mockProductData);

    const result = await service.scrapProduct('https://www.test.com/product');

    expect(result).toEqual(mockProductData);
    expect(mockCacheService.getScrapResult).toHaveBeenCalledWith(
      'https://www.test.com/product',
    );
    expect(mockScraper.extractWebsiteData).toHaveBeenCalledWith(
      'https://www.test.com/product',
    );
    expect(mockCacheService.setScrapResult).toHaveBeenCalledWith(
      'https://www.test.com/product',
      mockProductData,
    );
  });

  it('should propagate HTTP exceptions', async () => {
    const error = new NotFoundException('Product not found');
    mockCacheService.getScrapResult.mockResolvedValue(null);
    mockScraper.extractWebsiteData.mockRejectedValue(error);

    await expect(
      service.scrapProduct('https://www.test.com/product'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException for unknown errors', async () => {
    mockCacheService.getScrapResult.mockResolvedValue(null);
    mockScraper.extractWebsiteData.mockRejectedValue(
      new Error('Unknown error'),
    );

    await expect(
      service.scrapProduct('https://www.test.com/product'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should handle cache service errors gracefully', async () => {
    mockCacheService.getScrapResult.mockRejectedValue(new Error('Cache error'));
    mockScraper.extractWebsiteData.mockResolvedValue(mockProductData);

    await expect(
      service.scrapProduct('https://www.test.com/product'),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
