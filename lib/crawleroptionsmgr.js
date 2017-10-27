"use strict";

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
};

exports.CrawlerOptionsMgr = CrawlerOptionsMgr;