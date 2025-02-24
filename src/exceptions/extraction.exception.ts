import { ScrapProductDto } from '../dto/scrapProduct.dto';
import { NotFoundException } from '@nestjs/common';

export class ExtractionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExtractionException';
  }

  public static withMessage(message: string): ExtractionException {
    return new ExtractionException(message);
  }

  public static errorOnRetrieve(errorCode: string): ExtractionException {
    throw new NotFoundException(`Error while retrieving data: ${errorCode}`);
  }

  public static missingValue(
    extractionValues: ScrapProductDto,
  ): ExtractionException {
    if (extractionValues.title === '') {
      throw new ExtractionException(`Missing value for title`);
    }
    if (extractionValues.description === '') {
      throw new ExtractionException(`Missing value for description`);
    }
    if (extractionValues.price === '') {
      throw new ExtractionException(`Missing value for price`);
    }
    if (extractionValues.image === '') {
      throw new ExtractionException(`Missing value for image`);
    }
    if (extractionValues.url === '') {
      throw new ExtractionException(`Missing value for url`);
    }
    throw new ExtractionException(`Missing value for unknown field`);
  }
}
