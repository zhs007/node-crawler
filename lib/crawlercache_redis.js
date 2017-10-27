"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLERCACHE } = require('./basedef');
const { CrawlerCache } = require('./crawlercache');
const { RedisMgr } = require('./redismgr');
// const { createRedis } = require('./util');

const KEY_CURINDEX = 'crawlercore:curindex';
const KEY_LASTNUMS = 'crawlercore:lastnums';
const KEY_LASTINDEX = 'crawlercore:lastindex';
const KEY_CACHE = 'crawlercore:cache:';

class CrawlerCache_redis extends CrawlerCache {
    constructor(cfg) {
        super(cfg);

        this.redisid = cfg;
        // this.redisconn = undefined;
    }

    async init() {
        // this.redisconn = await createRedis(this.cfg);
    }

    async addCache(cache) {
        let lastindex = -1;
        let lastnums = -1;

        try {
            let redisconn = RedisMgr.singleton.getRedisConn(this.redisid);

            lastindex = await redisconn.incr(KEY_LASTINDEX);
            await redisconn.set(KEY_CACHE + lastindex, JSON.stringify(cache));
            lastnums = await redisconn.incr(KEY_LASTNUMS);
        }
        catch(err) {

        }

        return {
            lastindex: lastindex,
            lastnums: lastnums
        };
    }

    async getCache() {
        try {
            let redisconn = RedisMgr.singleton.getRedisConn(this.redisid);

            let lastnums = await redisconn.get(KEY_LASTNUMS);
            if (lastnums > 0) {
                await redisconn.decr(KEY_LASTNUMS);
                let curindex = await redisconn.incr(KEY_CURINDEX);
                let cache = await redisconn.set(KEY_CACHE + curindex);
                await redisconn.del(KEY_CACHE + curindex);
                return JSON.parse(cache);
            }
        }
        catch(err) {

        }

        return undefined;
    }
};

CrawlerMgr.singleton.regCrawlerCache(CRAWLERCACHE.REDIS, (cfg) => {
    return new CrawlerCache_redis(cfg);
});

exports.CrawlerCache_redis = CrawlerCache_redis;