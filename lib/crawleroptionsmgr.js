"use strict";

const { CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE, CRAWLEROPTIONS } = require('./basedef');

function func_getcache(options) {
    return {
        uri: options.uri,
        timeout: options.timeout,
        crawler_type: options.crawler_type,
        dataanalysis_type: options.dataanalysis_type,
    };
}

function func_setcache(options, cache) {
    options.uri = cache.uri;
    options.timeout = cache.timeout;
    options.crawler_type = cache.crawler_type;
    options.dataanalysis_type = cache.dataanalysis_type;
}

class CrawlerOptionsMgr {
    constructor() {
        this.mapOptions = {};
    }

    // funcNew()
    regOptions(typename, funcNew) {
        this.mapOptions[typename] = funcNew;
    }

    newOptions(typename) {
        if (this.mapOptions.hasOwnProperty(typename)) {
            return this.mapOptions[typename]();
        }

        return undefined;
    }

    _safeOptions(options) {
        if (!options.hasOwnProperty('typename')) {
            options.typename = CRAWLEROPTIONS.DEFAULT;
        }

        if (!options.hasOwnProperty('func_getcache')) {
            options.func_getcache = func_getcache;
        }

        if (!options.hasOwnProperty('func_setcache')) {
            options.func_setcache = func_setcache;
        }

        if (!options.hasOwnProperty('crawler_type')) {
            options.crawler_type = CRAWLER.REQUEST;
        }

        if (!options.hasOwnProperty('dataanalysis_type')) {
            options.dataanalysis_type = DATAANALYSIS.NULL;
        }

        if (!options.hasOwnProperty('storage_type')) {
            options.storage_type = STORAGE.NULL;
        }
    }
};

exports.CrawlerOptionsMgr = CrawlerOptionsMgr;