import puppeteer from 'puppeteer';

interface ScrapResult {
  title: string;
  description: string;
  price: string;
  image: string;
  url: string;
}

export const extractWebsiteData = async (url: string): Promise<ScrapResult> => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url);

    const result = await page.evaluate(() => {
      const titleElement = document.querySelector('p')?.innerText;
      const descriptionElement = document.querySelector<HTMLElement>(
        '[data-testid="rich-content-container"]',
      )?.innerText;
      const priceElement = document.querySelector<HTMLElement>(
        '[data-testid="price-value"]',
      )?.innerText;
      const imageElement = document.querySelector(
        '[data-testid="image-selected-thumbnail"]',
      ) as HTMLImageElement;

      return {
        title: titleElement ?? '',
        description: descriptionElement ?? '',
        price: priceElement ?? '',
        image: imageElement ? imageElement.src || '' : '',
        url: window.location.href,
      };
    });

    await browser.close();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Scraping error:', error.message);
      throw new Error(`Failed to scrape product: ${error.message}`);
    }
    throw new Error('An unknown error occurred while scraping');
  }
};
