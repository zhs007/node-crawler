"use strict";

const { CRAWLER } = require('./basedef');
const Crawler = require('./crawler').Crawler;
const CrawlerMgr = require('./crawlermgr');
const rp = require('request-promise');
const cheerio = require('cheerio');

class Crawler_HeadlessChrome extends Crawler {

    constructor(options) {
        super(options);
    }

    async start() {
        let self = this;

        await rp(self.options)
            .then(function (data) {
                self.onProcess(data);
            })
            .catch(function (err) {
                self.onError(err);
            });

        return self;
    }
};

CrawlerMgr.singleton.regCrawler(CRAWLER.HEADLESSCHROME, function (options) {
    return new Crawler_HeadlessChrome(options);
});

exports.Crawler_HeadlessChrome = Crawler_HeadlessChrome;