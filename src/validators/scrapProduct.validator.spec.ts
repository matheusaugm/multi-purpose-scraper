import { ScrapProductValidator } from './scrapProduct.validator';
import { ScrapProductDto } from '../dto/scrapProduct.dto';
import { ExtractionException } from '../exceptions/extraction.exception';

describe('ScrapProductValidator', () => {
  let validator: ScrapProductValidator;
  let validProduct: ScrapProductDto;

  beforeEach(() => {
    validator = new ScrapProductValidator();
    validProduct = new ScrapProductDto(
      'https://example.com',
      'Test Product',
      'https://example.com/image.jpg',
      'R$ 99,99',
      'Test Description',
    );
  });

  it('should validate a correct product without throwing', () => {
    expect(() => validator.validate(validProduct)).not.toThrow();
  });

  it('should throw ExtractionException for missing title', () => {
    const product = { ...validProduct, title: '' };
    expect(() => validator.validate(product)).toThrow(
      new ExtractionException('Missing value for title'),
    );
  });

  it('should throw ExtractionException for missing description', () => {
    const product = { ...validProduct, description: '' };
    expect(() => validator.validate(product)).toThrow(
      new ExtractionException('Missing value for description'),
    );
  });

  it('should throw ExtractionException for missing price', () => {
    const product = { ...validProduct, price: '' };
    expect(() => validator.validate(product)).toThrow(
      new ExtractionException('Missing value for price'),
    );
  });

  it('should throw ExtractionException for missing image', () => {
    const product = { ...validProduct, image: '' };
    expect(() => validator.validate(product)).toThrow(
      new ExtractionException('Missing value for image'),
    );
  });

  it('should throw ExtractionException for missing url', () => {
    const product = { ...validProduct, url: '' };
    expect(() => validator.validate(product)).toThrow(
      new ExtractionException('Missing value for url'),
    );
  });

  it('should throw ExtractionException for non-ExtractionException errors', () => {
    expect(() => validator.validate(null as any)).toThrow(
      new ExtractionException('Invalid product data'),
    );
  });
});
