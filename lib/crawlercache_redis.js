"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLERCACHE } = require('./basedef');
const { CrawlerCache } = require('./crawlercache');
const { createRedis } = require('./util');

class CrawlerCache_redis extends CrawlerCache {
    constructor(cfg) {
        super(cfg);

        this.cfg = cfg;
        this.redisconn = undefined;
    }

    async init() {
        this.redisconn = await createRedis(this.cfg);
    }
};

CrawlerMgr.singleton.regCrawlerCache(CRAWLERCACHE.NULL, (cfg) => {
    return new CrawlerCache_redis(cfg);
});

exports.CrawlerCache_redis = CrawlerCache_redis;