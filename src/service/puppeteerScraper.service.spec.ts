import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerScraper } from './puppeteerScraper.service';
import { ScrapProductValidator } from '../validators/scrapProduct.validator';
import { BrowserManager } from '../config/browser/browserManager';
import { PageStrategyFactoryService } from './pageStrategyFactory.service';
import { Browser, Page, HTTPResponse } from 'puppeteer';
import { ScrapProductDto } from '../dto/scrapProduct.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PageStrategy } from '../interfaces/pageStrategy.interface';

describe('PuppeteerScraper', () => {
  let scraper: PuppeteerScraper;

  const mockProductData = {
    url: 'https://www.test.com/product',
    title: 'Test Product',
    image: 'http://test.com/image.jpg',
    price: 'R$ 99,99',
    description: 'Test Description',
  };

  const mockResponse = {
    status: jest.fn().mockReturnValue(200),
  } as unknown as HTTPResponse;

  const gotoMock = jest.fn().mockResolvedValue(mockResponse);
  const closeMock = jest.fn();
  const browserCloseMock = jest.fn();
  const extractDataMock = jest.fn().mockResolvedValue(mockProductData);
  const validateMock = jest.fn();
  const getStrategyMock = jest.fn();

  const mockPage = {
    goto: gotoMock,
    close: closeMock,
  } as unknown as Page;

  const mockBrowser = {
    close: browserCloseMock,
  } as unknown as Browser;

  const mockStrategy = {
    extractData: extractDataMock,
  } as unknown as PageStrategy;

  const mockBrowserManager = {
    createPage: jest
      .fn()
      .mockResolvedValue({ browser: mockBrowser, page: mockPage }),
  };

  const mockValidator = {
    validate: validateMock,
  };

  const mockStrategyFactory = {
    getStrategy: getStrategyMock.mockReturnValue(mockStrategy),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuppeteerScraper,
        {
          provide: ScrapProductValidator,
          useValue: mockValidator,
        },
        {
          provide: BrowserManager,
          useValue: mockBrowserManager,
        },
        {
          provide: PageStrategyFactoryService,
          useValue: mockStrategyFactory,
        },
      ],
    }).compile();

    scraper = module.get<PuppeteerScraper>(PuppeteerScraper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(scraper).toBeDefined();
  });

  it('should successfully extract website data', async () => {
    const result = await scraper.extractWebsiteData(
      'https://www.test.com/product',
    );

    expect(result).toBeInstanceOf(ScrapProductDto);
    expect(result).toEqual(expect.objectContaining(mockProductData));
    expect(mockBrowserManager.createPage).toHaveBeenCalled();
    expect(gotoMock).toHaveBeenCalledWith('https://www.test.com/product');
    expect(extractDataMock).toHaveBeenCalledWith(mockPage);
    expect(validateMock).toHaveBeenCalled();
    expect(browserCloseMock).toHaveBeenCalled();
  });

  it('should throw NotFoundException when page returns 404', async () => {
    const notFoundResponse = {
      ...mockResponse,
      status: jest.fn().mockReturnValue(404),
    };
    gotoMock.mockResolvedValueOnce(notFoundResponse as unknown as HTTPResponse);

    await expect(
      scraper.extractWebsiteData('https://www.test.com/product'),
    ).rejects.toThrow(NotFoundException);
    expect(browserCloseMock).toHaveBeenCalled();
  });

  it('should handle network errors', async () => {
    gotoMock.mockRejectedValueOnce(new Error('net::ERR_NAME_NOT_RESOLVED'));

    await expect(
      scraper.extractWebsiteData('https://www.test.com/product'),
    ).rejects.toThrow(NotFoundException);
    expect(browserCloseMock).toHaveBeenCalled();
  });

  it('should handle timeout errors', async () => {
    gotoMock.mockRejectedValueOnce(new Error('net::ERR_CONNECTION_TIMED_OUT'));

    await expect(
      scraper.extractWebsiteData('https://www.test.com/product'),
    ).rejects.toThrow(BadRequestException);
    expect(browserCloseMock).toHaveBeenCalled();
  });

  it('should handle validation errors', async () => {
    validateMock.mockImplementationOnce(() => {
      throw new BadRequestException('Validation error');
    });

    await expect(
      scraper.extractWebsiteData('https://www.test.com/product'),
    ).rejects.toThrow(BadRequestException);
    expect(browserCloseMock).toHaveBeenCalled();
  });
});
