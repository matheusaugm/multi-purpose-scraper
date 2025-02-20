import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { extractWebsiteData } from '../component/extractWebsiteData.component';

@Injectable()
export class ScrapProductService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async scrapProduct(url: string): Promise<ScrapResult> {
    try {
      const cachedResults = await this.cacheManager.get<ScrapResult>(url);

      // Check if URL exists in cache

      if (cachedResults) {
        return cachedResults;
      }

      // If not in cache, fetch new data
      const productData = await this.fetchProductData(url);
      await this.cacheManager.set(url, productData, 360000);

      return productData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.cause;
      }
      throw new Error('An unknown error occurred');
    }
  }

  private async fetchProductData(url: string): Promise<ScrapResult> {
    /* get title for magalu
    * document.querySelector('[data-testid="heading-product-title"]').innerHTML
      get price for magalu
      * document.querySelector('[data-testid="price-value"]').innerText
      * get image for magalu
      * document.querySelector('[data-testid="image-selected-thumbnail"]').src
      * get description for magalu
      * document.querySelector('[data-testid="rich-content-container"]').innerText


    * */
    const test = await extractWebsiteData(url);
    console.log(test);
    return Promise.resolve({
      title: 'Product Title',
      image: 'https://example.com/image.jpg',
      price: '100.00',
      description: 'Product Description',
      url: url,
    });
  }
}
