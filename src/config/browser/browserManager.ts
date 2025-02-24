import { Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { BrowserConfig } from './browser.config';
import { UserAgentGenerator } from './userAgentGenerator';
import { BROWSER_CONFIG_TOKEN } from '../../constants/tokens';

@Injectable()
export class BrowserManager {
  constructor(
    @Inject(BROWSER_CONFIG_TOKEN) private readonly browserConfig: BrowserConfig,
    private readonly userAgentGenerator: UserAgentGenerator,
  ) {}

  async createPage(): Promise<{ browser: Browser; page: Page }> {
    const browser = await puppeteer.launch(
      this.browserConfig.getLaunchOptions(),
    );
    const page = await browser.newPage();
    const userAgent = this.userAgentGenerator.generate();
    await page.setUserAgent(userAgent);

    await page.setExtraHTTPHeaders({
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language':
        'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,pt-PT;q=0.5',
      'sec-ch-ua':
        '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      priority: 'u=0, i',
    });

    return { browser, page };
  }
}
