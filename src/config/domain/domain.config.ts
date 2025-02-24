import { Injectable } from '@nestjs/common';

@Injectable()
export class DomainConfiguration {
  private readonly _allowedDomains = [
    'magazineluiza.com.br',
    'pontofrio.com.br',
    'casasbahia.com.br',
    'amaro.com',
    'webscraper.io',
  ];

  get allowedDomains(): string[] {
    return this._allowedDomains;
  }

  isDomainAllowed(domain: string): boolean {
    return this._allowedDomains.some((allowed) =>
      domain.toLowerCase().includes(allowed.toLowerCase()),
    );
  }
}
