export interface Scraper {
  extractWebsiteData(url: string): Promise<ScrapResult>;
}
