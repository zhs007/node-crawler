"use strict";

class CrawlerOptionsMgr {
    constructor() {
        this.mapOptions = {};
    }

    // funcNew(cache)
    regOptions(typename, funcNew) {
        this.mapOptions[typename] = funcNew;
    }
};

exports.CrawlerOptionsMgr = CrawlerOptionsMgr;