"use strict";

class CrawlerOptionsMgr {
    constructor() {
        this.mapOptions = {};
    }

    // funcNew(cache)
    regOptions(typename, funcNew) {
        this.mapOptions[typename] = funcNew;
    }

    newOptions(cache) {
        if (this.mapOptions.hasOwnProperty(cache.typename)) {
            return this.mapOptions[cache.typename](cache);
        }

        return undefined;
    }
};

exports.CrawlerOptionsMgr = CrawlerOptionsMgr;