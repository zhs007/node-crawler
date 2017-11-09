"use strict";

const { CRAWLER } = require('./basedef');
const Crawler = require('./crawler').Crawler;
const CrawlerMgr = require('./crawlermgr');
const ChromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

class Crawler_HeadlessChrome extends Crawler {

    constructor(options) {
        super(options);

        if (!options.hasOwnProperty('headlesschromeoptions')) {
            options.headlesschromeoptions = {};
        }

        if (!options.headlesschromeoptions.hasOwnProperty('port')) {
            options.headlesschromeoptions.port = 9222;
        }

        if (!options.headlesschromeoptions.hasOwnProperty('autoSelectChrome')) {
            options.headlesschromeoptions.autoSelectChrome = true;
        }

        if (!options.headlesschromeoptions.hasOwnProperty('additionalFlags')) {
            options.headlesschromeoptions.additionalFlags = ['--window-size=1136,640', '--disable-gpu', '--headless'];
        }
    }

    async launchChrome() {
        return await ChromeLauncher.launch(this.options.headlesschromeoptions);
    }

    async start() {
        this.launcher = await this.launchChrome();
        this.client = await CDP();

        return this;
    }
};

CrawlerMgr.singleton.regCrawler(CRAWLER.HEADLESSCHROME, function (options) {
    return new Crawler_HeadlessChrome(options);
});

exports.Crawler_HeadlessChrome = Crawler_HeadlessChrome;