import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScrapProductController } from './controller/scrapProduct.controller';
import { ScrapProductService } from './service/scrapProduct.service';
import { PuppeteerScraper } from './service/puppeteerScraper.service';
import { ScrapProductValidator } from './validators/scrapProduct.validator';
import { DomainConfiguration } from './config/domain/domain.config';
import {
  SCRAPER_TOKEN,
  PAGE_STRATEGY_TOKEN,
  BROWSER_CONFIG_TOKEN,
} from './constants/tokens';
import { MagaluPageStrategy } from './service/strategies/magaluPageStrategy.service';
import { CacheService } from './service/cacheService.service';
import { UrlValidationMiddleware } from './middleware/scrapProduct.middleware';
import { DefaultBrowserConfig } from './config/browser/browser.config';
import { BrowserManager } from './config/browser/browserManager';
import { UserAgentGenerator } from './config/browser/userAgentGenerator';
import { PageStrategyFactoryService } from './service/pageStrategyFactory.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [ScrapProductController],
  providers: [
    ScrapProductService,
    ScrapProductValidator,
    DomainConfiguration,
    UserAgentGenerator,
    BrowserManager,
    CacheService,
    PageStrategyFactoryService,
    MagaluPageStrategy,
    {
      provide: BROWSER_CONFIG_TOKEN,
      useClass: DefaultBrowserConfig,
    },
    {
      provide: PAGE_STRATEGY_TOKEN,
      useClass: MagaluPageStrategy,
    },
    {
      provide: SCRAPER_TOKEN,
      useClass: PuppeteerScraper,
    },
  ],
})
export class ScrapProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UrlValidationMiddleware)
      .forRoutes({ path: 'scrap-product/:url', method: RequestMethod.GET });
  }
}
