"use strict";

const { CRAWLER } = require('./basedef');
const Crawler = require('./crawler').Crawler;
const CrawlerMgr = require('./crawlermgr');
const { HeadlessChromeMgr } = require('./headlesschromemgr');
const CDP = require('chrome-remote-interface');

class Crawler_HeadlessChrome extends Crawler {

    constructor(options) {
        super(options);
    }

    async launchChrome() {
        let launcher = await HeadlessChromeMgr.singleton.getHeadlessChrome(this.options.headlesschromename);
        return launcher;
    }

    async start() {
        let option = HeadlessChromeMgr.singleton.getOption(this.options.headlesschromename);
        let launcher = await this.launchChrome();
        let target = await CDP.New({port: option.port});
        this.client = await CDP({target});

        return this;
    }
};

CrawlerMgr.singleton.regCrawler(CRAWLER.HEADLESSCHROME, function (options) {
    return new Crawler_HeadlessChrome(options);
});

exports.Crawler_HeadlessChrome = Crawler_HeadlessChrome;