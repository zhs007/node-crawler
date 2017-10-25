"use strict";

const { DATAANALYSIS } = require('./basedef');
const DataAnalysis = require('./dataanalysis').DataAnalysis;
const CrawlerMgr = require('./crawlermgr');
const cheerio = require('cheerio');

class DA_Cheerio extends DataAnalysis {

    constructor(crawler) {
        super(crawler);
    }

    async onAnalysis() {
        this.data = cheerio.load(this.crawler.data);

        return this;
    }
};

CrawlerMgr.singleton.regDataAnalysis(DATAANALYSIS.CHEERIO, function (crawler) {
    return new DA_Cheerio(crawler);
});

exports.DA_cheerio = DA_Cheerio;