import { Injectable } from '@nestjs/common';
import { ScrapProductDto } from '../dto/scrapProduct.dto';
import { ExtractionException } from '../exceptions/extraction.exception';

@Injectable()
export class ScrapProductValidator {
  validate(product: ScrapProductDto): void {
    try {
      if (!product.title) {
        throw ExtractionException.withMessage('Missing value for title');
      }
      if (!product.description) {
        throw ExtractionException.withMessage('Missing value for description');
      }
      if (!product.price) {
        throw ExtractionException.withMessage('Missing value for price');
      }
      if (!product.image) {
        throw ExtractionException.withMessage('Missing value for image');
      }
      if (!product.url) {
        throw ExtractionException.withMessage('Missing value for url');
      }
    } catch (error) {
      if (error instanceof ExtractionException) {
        throw error;
      }
      throw ExtractionException.withMessage('Invalid product data');
    }
  }
}
