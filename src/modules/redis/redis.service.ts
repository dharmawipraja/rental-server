import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { RedisOptions } from './types/RedisOptions.types';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: string, options: RedisOptions) {
    const config = { ttl: 0, ...options };
    return await this.cacheManager.set(key, value, config);
  }

  async del(key: string) {
    return await this.cacheManager.del(key);
  }
}
