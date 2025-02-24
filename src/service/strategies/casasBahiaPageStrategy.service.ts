import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { PageStrategy } from '../../interfaces/pageStrategy.interface';

@Injectable()
export class CasasBahiaPageStrategy implements PageStrategy {
  async extractData(page: Page): Promise<ScrapResult> {
    return await page.evaluate(() => ({
      title: document.querySelector('h1')?.innerText ?? '',
      description:
        document.querySelector<HTMLElement>('#product-description')
          ?.innerText ?? '',
      price:
        document.querySelector<HTMLElement>(
          '#product-price > span:nth-child(2)',
        )?.innerText ?? 'Produto Indisponível',
      image:
        document.querySelector<HTMLImageElement>(
          '[aria-label="Imagem principal do produto"] img',
        )?.src ?? '',
      url: window.location.href,
    }));
  }
}
