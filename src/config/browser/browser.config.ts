import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';

export interface BrowserConfig {
  getLaunchOptions(): puppeteer.LaunchOptions;
}

@Injectable()
export class DefaultBrowserConfig implements BrowserConfig {
  getLaunchOptions(): puppeteer.LaunchOptions {
    return {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
  }
}
