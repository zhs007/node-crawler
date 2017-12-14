"use strict";

let { CrawlerMgr, CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE, getVal_CDPCallFrame, HeadlessChromeMgr, toXMLString } = require('../index');
let util = require('util');

const OPTIONS_TYPENAME = 'xml';

// 分析数据
async function func_analysis(crawler) {
    console.log(toXMLString(crawler.da.root));

    return crawler;
}

let xmlOptions = {
    typename: OPTIONS_TYPENAME,
    // 主地址
    uri: 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/30.svg',
    timeout: 6 * 30 * 1000,

    // 爬虫类型
    crawler_type: CRAWLER.REQUEST,

    // 数据分析配置
    dataanalysis_type: DATAANALYSIS.XML,

    // 分析数据
    func_analysis: func_analysis
};

function startXMLCrawler() {
    let op = Object.assign({}, xmlOptions);

    CrawlerMgr.singleton.addCrawler(op);
}

CrawlerMgr.singleton.regOptions(OPTIONS_TYPENAME, () => {
    let options = Object.assign({}, xmlOptions);
    return options;
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

CrawlerMgr.singleton.processCrawlerNums = 8;
CrawlerMgr.singleton.processDelayTime = 0.3;

CrawlerMgr.singleton.init().then(() => {
    startXMLCrawler();

    CrawlerMgr.singleton.start(true, true, async () => {
    }, true);
});
