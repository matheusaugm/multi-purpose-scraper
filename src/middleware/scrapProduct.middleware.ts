import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UrlValidationMiddleware implements NestMiddleware {
  private readonly allowedDomains = [
    'magazineluiza.com.br',
    'pontofrio.com.br',
    'casasbahia.com.br',
    'amaro.com',
    'webscraper.io',
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const url = req.params.url;

    if (!url) {
      throw new BadRequestException('URL parameter is required');
    }

    try {
      const urlObject = new URL(url);
      const domain = this.extractDomain(urlObject.hostname);

      if (!this.allowedDomains.some((allowed) => domain.includes(allowed))) {
        throw new BadRequestException('Domain not supported');
      }

      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('Invalid URL format');
      }
    }
  }

  private extractDomain(hostname: string): string {
    return hostname.toLowerCase().replace('www.', '');
  }
}
