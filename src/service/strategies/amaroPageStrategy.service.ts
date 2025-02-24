import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { PageStrategy } from '../../interfaces/pageStrategy.interface';

@Injectable()
export class AmaroPageStrategy implements PageStrategy {
  async extractData(page: Page): Promise<ScrapResult> {
    return await page.evaluate(() => ({
      title:
        document.querySelector<HTMLHeadElement>('h1.product__title')
          ?.innerText ?? '',
      description:
        Array.from(
          document.querySelectorAll(
            '.product__accordion__content div.rte p, .product__accordion__content div.rte li',
          ),
        )
          .map((element) => element.textContent?.trim())
          .filter(Boolean)
          .join('\n') ?? '',
      price:
        document.querySelector<HTMLElement>('[data-product-price]')
          ?.innerText ?? 'Produto Indisponível',
      image:
        document.querySelector<HTMLAnchorElement>('.product-single__media-link')
          ?.href ?? '',
      url: window.location.href,
    }));
  }
}
