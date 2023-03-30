'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  async getList(key, isChildObject = false) {
    const { redis } = this.app;
    let data = await redis.lrange(key, 0, -1);
    if (isChildObject) {
      data = data.map(item => JSON.parse(item));
    }
    return data;
  }

  async setList(key, value, type = 'push', expir = 0) {
    const { redis } = this.app;
    if (expir > 0) {
      await redis.expire(key, expir);
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    if (type === 'push') {
      return await redis.rpush(key, value);
    }
    return await redis.lpush(key, value);
  }

  async set(key, value, expir = 0) {
    const { redis } = this.app;
    if (expir === 0) {
      return await redis.set(key, JSON.stringify(value));
    }
    return await redis.set(key, JSON.stringify(value), 'EX', expir);
  }

  async get(key) {
    const { redis } = this.app;
    const result = await redis.get(key);
    return JSON.parse(result);
  }

  async incr(key, number = 1) {
    const { redis } = this.app;
    if (number === 1) {
      return await redis.incr(key);
    }
    return await redis.incrby(key, number);
  }

  async strlen(key) {
    const { redis } = this.app;
    return await redis.strlen(key);
  }

  async remove(key) {
    const { redis } = this.app;
    return await redis.del(key);
  }

  async clear() {
    return await this.app.redis.flushall();
  }
}

module.exports = CacheService;
