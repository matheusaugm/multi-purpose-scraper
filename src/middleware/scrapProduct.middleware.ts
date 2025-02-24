import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DomainConfiguration } from '../config/domain/domain.config';

@Injectable()
export class UrlValidationMiddleware implements NestMiddleware {
  constructor(private readonly domainConfig: DomainConfiguration) {}

  use(req: Request, res: Response, next: NextFunction) {
    const url = req.params.url;

    if (!url) {
      throw new BadRequestException('URL parameter is required');
    }

    try {
      const urlObject = new URL(url);
      const domain = this.extractDomain(urlObject.hostname);

      if (!this.domainConfig.isDomainAllowed(domain)) {
        throw new BadRequestException(
          'Scraping is not allowed for this domain',
        );
      }

      next();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid URL format');
    }
  }

  private extractDomain(hostname: string): string {
    return hostname.toLowerCase().replace('www.', '');
  }
}
