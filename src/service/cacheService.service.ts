import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStrategy } from '../interfaces/cacheStrategy.interface';

@Injectable()
export class CacheService implements CacheStrategy {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl = 360000): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getScrapResult(url: string): Promise<ScrapResult | null> {
    return await this.get<ScrapResult>(url);
  }

  async setScrapResult(url: string, result: ScrapResult): Promise<void> {
    await this.set(url, result);
  }
}
