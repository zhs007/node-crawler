"use strict";

const { CRAWLER, HEADLESSCHROMETYPE } = require('./basedef');
const Crawler = require('./crawler').Crawler;
const CrawlerMgr = require('./crawlermgr');
const { HeadlessChromeMgr } = require('./headlesschromemgr');
const { getDocumentText_CDP, getDocumentHtml_CDP } = require('./util');
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

        let hctype = HEADLESSCHROMETYPE.NULL;
        if (this.options.hasOwnProperty('headlesschrometype')) {
            hctype = this.options.headlesschrometype;
        }

        if (hctype == HEADLESSCHROMETYPE.GETHTML) {
            let str = await getDocumentHtml_CDP(this.options.uri);

            this.onProcess(str);
        }
        else if (hctype == HEADLESSCHROMETYPE.GETTEXT) {
            let str = await getDocumentText_CDP(this.options.uri);

            this.onProcess(str);
        }

        return this;
    }
};

CrawlerMgr.singleton.regCrawler(CRAWLER.HEADLESSCHROME, function (options) {
    return new Crawler_HeadlessChrome(options);
});

exports.Crawler_HeadlessChrome = Crawler_HeadlessChrome;