import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { PageStrategy } from '../../interfaces/pageStrategy.interface';

@Injectable()
export class MagaluPageStrategy implements PageStrategy {
  async extractData(page: Page): Promise<ScrapResult> {
    return await page.evaluate(() => ({
      title: document.querySelector('h1')?.innerText ?? '',
      description:
        document.querySelector<HTMLElement>(
          '[data-testid="rich-content-container"]',
        )?.innerText ?? '',
      price:
        document
          .querySelector<HTMLElement>(
            '[data-testid="product-price"] [data-testid="price-value"] ',
          )
          ?.innerText.replace('ou ', '') ?? 'Produto Indisponível',
      image:
        document.querySelector<HTMLImageElement>(
          '[data-testid="image-selected-thumbnail"]',
        )?.src ?? '',
      url: window.location.href,
    }));
  }
}
