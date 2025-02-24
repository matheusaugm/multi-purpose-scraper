import { Page } from 'puppeteer';

export interface PageStrategy {
  extractData(page: Page): Promise<ScrapResult>;
}
