import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cacheService.service';

describe('CacheService', () => {
  let service: CacheService;
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockScrapResult: ScrapResult = {
    url: 'https://test.com/product',
    title: 'Test Product',
    price: 'R$ 99,99',
    image: 'https://test.com/image.jpg',
    description: 'Test product description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return cached value when it exists', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockScrapResult);

      const result = await service.get('test-key');

      expect(result).toEqual(mockScrapResult);
      expect(mockCacheManager.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when value is not in cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);

      const result = await service.get('test-key');

      expect(result).toBeNull();
      expect(mockCacheManager.get).toHaveBeenCalledWith('test-key');
    });
  });

  describe('set', () => {
    it('should cache value with default TTL', async () => {
      await service.set('test-key', mockScrapResult);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'test-key',
        mockScrapResult,
        360000,
      );
    });

    it('should cache value with custom TTL', async () => {
      await service.set('test-key', mockScrapResult, 1800);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'test-key',
        mockScrapResult,
        1800,
      );
    });
  });

  describe('getScrapResult', () => {
    it('should return cached scrap result', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockScrapResult);

      const result = await service.getScrapResult('test-url');

      expect(result).toEqual(mockScrapResult);
      expect(mockCacheManager.get).toHaveBeenCalledWith('test-url');
    });
  });

  describe('setScrapResult', () => {
    it('should cache scrap result', async () => {
      await service.setScrapResult('test-url', mockScrapResult);

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'test-url',
        mockScrapResult,
        360000,
      );
    });
  });
});
