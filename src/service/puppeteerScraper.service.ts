import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Scraper } from '../interfaces/scraper.interface';
import { ScrapProductDto } from '../dto/scrapProduct.dto';
import { ScrapProductValidator } from '../validators/scrapProduct.validator';
import { ExtractionException } from '../exceptions/extraction.exception';
import { BrowserManager } from '../config/browser/browserManager';
import { PageStrategyFactoryService } from './pageStrategyFactory.service';
import { PageStrategy } from '../interfaces/pageStrategy.interface';

@Injectable()
export class PuppeteerScraper implements Scraper {
  constructor(
    private readonly validator: ScrapProductValidator,
    private readonly browserManager: BrowserManager,
    private readonly strategyFactory: PageStrategyFactoryService,
  ) {}

  async extractWebsiteData(url: string): Promise<ScrapProductDto> {
    let browser: puppeteer.Browser | null = null;

    try {
      const { browser: newBrowser, page } = await this.initializeBrowser(url);
      browser = newBrowser;

      const response = await page.goto(url);
      this.validateResponse(response);

      const result = await this.extractData(page, url);
      return this.validateAndCreateDto(result);
    } catch (error) {
      if (error instanceof Error) {
        throw this.handleError(error);
      }
      throw new InternalServerErrorException(
        `Error scraping product data, ${error}`,
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async initializeBrowser(url: string) {
    const domain = new URL(url).hostname;
    this.strategyFactory.getStrategy(domain);
    return await this.browserManager.createPage();
  }

  private validateResponse(response: puppeteer.HTTPResponse | null): void {
    if (!response) {
      throw new BadRequestException('Failed to load page');
    }

    const status = response.status();
    if (status === 404) {
      throw new NotFoundException(`Product not found (HTTP ${status})`);
    }
    if (status >= 400) {
      throw new BadRequestException(`Failed to load page (HTTP ${status})`);
    }
  }

  private async extractData(page: puppeteer.Page, url: string) {
    const domain = new URL(url).hostname;
    const strategy: PageStrategy = this.strategyFactory.getStrategy(domain);
    return await strategy.extractData(page);
  }

  private validateAndCreateDto(result: ScrapProductDto): ScrapProductDto {
    const dto = new ScrapProductDto(
      result.url,
      result.title,
      result.image,
      result.price,
      result.description,
    );
    this.validator.validate(dto);
    return dto;
  }

  private handleError(error: Error): Error {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      return error;
    }
    if (error instanceof ExtractionException) {
      return new BadRequestException(error.message);
    }
    return this.handleNetworkError(error);
  }

  private handleNetworkError(error: Error): Error {
    const message = error.message;
    if (message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      return new NotFoundException('Product URL not found');
    }
    if (message.includes('No strategy found')) {
      return new BadRequestException(message);
    }
    if (message.includes('net::ERR_CONNECTION_TIMED_OUT')) {
      return new BadRequestException('Connection timed out');
    }
    return new InternalServerErrorException('Error scraping product data');
  }
}
