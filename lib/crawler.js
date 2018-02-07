"use strict";

const CrawlerMgr = require('./crawlermgr');

class Crawler {

    constructor(options) {
        this.options = options;
        this.data = undefined;
        this.da = undefined;
        this.storage = undefined;
    }

    async start() {
        return this;
    }

    async save() {
        if (this.storage != undefined) {
            await this.storage.onSave();
        }

        return this;
    }

    onProcess(data) {
        this.data = data;
    }

    onError(err) {
        if (this.options.func_onerror) {
            this.options.func_onerror(this, err);
        }
    }
};

exports.Crawler = Crawler;