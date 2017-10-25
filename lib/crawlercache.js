"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLERCACHE } = require('./basedef');

class CrawlerCache {

    constructor(cfg) {
    }

    async init() {
    }
};

CrawlerMgr.singleton.regCrawlerCache(CRAWLERCACHE.NULL, (cfg) => {
    return new CrawlerCache(cfg);
});

exports.CrawlerCache = CrawlerCache;