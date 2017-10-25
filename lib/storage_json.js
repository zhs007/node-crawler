"use strict";

const { STORAGE } = require('./basedef');
const { Storage } = require('./storage');
const CrawlerMgr = require('./crawlermgr');
const fs = require('fs');

class Storage_json extends Storage {

    constructor(crawler) {
        super(crawler);
    }

    async onSave() {
        if (this.data.length > 0) {
            fs.writeFileSync(this.crawler.options.storage_cfg.filename, JSON.stringify(this.data));
        }

        return this.crawler;
    }
};

CrawlerMgr.singleton.regStorage(STORAGE.JSON, function (crawler) {
    return new Storage_json(crawler);
});

exports.Storage_json = Storage_json;