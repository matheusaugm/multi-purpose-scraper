import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Scraper } from '../interfaces/scraper.interface';
import { SCRAPER_TOKEN } from '../constants/tokens';
import { CacheService } from './cacheService.service';

@Injectable()
export class ScrapProductService {
  private readonly logger = new Logger(ScrapProductService.name);

  constructor(
    private readonly cacheService: CacheService,
    @Inject(SCRAPER_TOKEN) private readonly scraper: Scraper,
  ) {}

  async scrapProduct(url: string): Promise<ScrapResult> {
    try {
      const cachedResults = await this.cacheService.getScrapResult(url);

      if (cachedResults) {
        return cachedResults;
      }

      const productData = await this.scraper.extractWebsiteData(url);
      await this.cacheService.setScrapResult(url, productData);

      return productData;
    } catch (error: unknown) {
      this.logger.error(
        `${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
}
