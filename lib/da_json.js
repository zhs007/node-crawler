"use strict";

const { DATAANALYSIS } = require('./basedef');
const DataAnalysis = require('./dataanalysis').DataAnalysis;
const CrawlerMgr = require('./crawlermgr');

class DA_JSON extends DataAnalysis {

    constructor(crawler) {
        super(crawler);

        this.obj = undefined;
    }

    async onAnalysis() {
        this.data = this.crawler.data;
        this.obj = JSON.parse(this.data);

        return this;
    }
};

CrawlerMgr.singleton.regDataAnalysis(DATAANALYSIS.JSON, function (crawler) {
    return new DA_JSON(crawler);
});

exports.DA_JSON = DA_JSON;