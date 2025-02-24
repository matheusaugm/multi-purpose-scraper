import { Test, TestingModule } from '@nestjs/testing';
import { UrlValidationMiddleware } from '../middleware/scrapProduct.middleware';
import { DomainConfiguration } from '../config/domain/domain.config';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

describe('UrlValidationMiddleware', () => {
  let middleware: UrlValidationMiddleware;
  let domainConfig: DomainConfiguration;
  const mockDomainConfig = {
    isDomainAllowed: jest.fn((domain: string) => {
      return ['magazineluiza.com.br', 'casasbahia.com.br'].includes(domain);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlValidationMiddleware,
        {
          provide: DomainConfiguration,
          useValue: mockDomainConfig,
        },
      ],
    }).compile();

    middleware = module.get<UrlValidationMiddleware>(UrlValidationMiddleware);
    domainConfig = module.get<DomainConfiguration>(DomainConfiguration);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockResponse = {} as Response;
  const mockNext = jest.fn();

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should allow valid URLs from allowed domains', () => {
    const mockRequest = {
      params: {
        url: 'https://www.casasbahia.com.br/produto/123',
      },
    } as unknown as Request;

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).not.toThrow();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid URLs', () => {
    const mockRequest = {
      params: {
        url: 'invalid-url',
      },
    } as unknown as Request;

    expect(() => {
      middleware.use(mockRequest, mockResponse, mockNext);
    }).toThrow(BadRequestException);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockDomainConfig.isDomainAllowed).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for disallowed domains', () => {
    const mockRequest = {
      params: {
        url: 'https://www.amazon.com/product/123',
      },
    } as unknown as Request;

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      BadRequestException,
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when URL is missing', () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;

    expect(() => middleware.use(mockRequest, mockResponse, mockNext)).toThrow(
      BadRequestException,
    );
  });

  it('should handle URLs with www prefix correctly', () => {
    const mockRequest = {
      params: {
        url: 'https://www.magazineluiza.com.br/produto/123',
      },
    } as unknown as Request;

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).not.toThrow();
    expect(mockNext).toHaveBeenCalled();
  });
});
