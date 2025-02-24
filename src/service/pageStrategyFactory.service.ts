import { Injectable } from '@nestjs/common';
import { MagaluPageStrategy } from './strategies/magaluPageStrategy.service';
import { PontoFrioPageStrategy } from './strategies/pontoFrioPageStrategy.service';
import { CasasBahiaPageStrategy } from './strategies/casasBahiaPageStrategy.service';
import { AmaroPageStrategy } from './strategies/amaroPageStrategy.service';
import { PageStrategy } from '../interfaces/pageStrategy.interface';
import { StrategyException } from '../exceptions/strategy.exception';

@Injectable()
export class PageStrategyFactoryService {
  getStrategy(domainName: string): PageStrategy {
    switch (domainName) {
      case 'www.magazineluiza.com.br':
        return new MagaluPageStrategy();
      case 'www.pontofrio.com.br':
        return new PontoFrioPageStrategy();
      case 'www.casasbahia.com.br':
        return new CasasBahiaPageStrategy();
      case 'amaro.com':
        return new AmaroPageStrategy();
      default:
        throw new StrategyException('No strategy found for this domain');
    }
  }
}
