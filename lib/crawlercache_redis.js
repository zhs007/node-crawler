"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLERCACHE } = require('./basedef');
const { CrawlerCache } = require('./crawlercache');
const { createRedis } = require('./util');

const KEY_CURINDEX = 'crawlercore:curindex';
const KEY_LASTNUMS = 'crawlercore:lastnums';
const KEY_LASTINDEX = 'crawlercore:lastindex';
const KEY_CACHE = 'crawlercore:cache:';

class CrawlerCache_redis extends CrawlerCache {
    constructor(cfg) {
        super(cfg);

        this.cfg = cfg;
        this.redisconn = undefined;
    }

    async init() {
        this.redisconn = await createRedis(this.cfg);
    }

    async addCache(cache) {
        let lastindex = await this.redisconn.incr(KEY_LASTINDEX);
        await this.redisconn.set(KEY_CACHE + lastindex, JSON.stringify(cache));
        let lastnums = await this.redisconn.incr(KEY_LASTNUMS);

        return {
            lastindex: lastindex,
            lastnums: lastnums
        };
    }

    async getCache() {
        let lastnums = await this.redisconn.get(KEY_LASTNUMS);
        if (lastnums > 0) {
            await this.redisconn.decr(KEY_LASTNUMS);
            let curindex = await this.redisconn.incr(KEY_CURINDEX);
            let cache = await this.redisconn.set(KEY_CACHE + curindex);
            await this.redisconn.del(KEY_CACHE + curindex);
            return JSON.parse(cache);
        }

        return undefined;
    }
};

CrawlerMgr.singleton.regCrawlerCache(CRAWLERCACHE.NULL, (cfg) => {
    return new CrawlerCache_redis(cfg);
});

exports.CrawlerCache_redis = CrawlerCache_redis;