"use strict";

let { CrawlerMgr, CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE, getVal_CDPCallFrame, HeadlessChromeMgr } = require('../index');
let util = require('util');

const OPTIONS_TYPENAME = 'headlesschrome2';

const HEADLESSCHROME_NAME = 'headlesschrome2';
const HEADLESSCHROME_OPTION = {
    port: 9222,
    autoSelectChrome: true,
    additionalFlags: ['--window-size=1136,640', '--disable-gpu', '--headless']
};

HeadlessChromeMgr.singleton.addHeadlessChrome(HEADLESSCHROME_NAME, HEADLESSCHROME_OPTION);

// 分析数据
async function func_analysis(crawler) {
    const { Page, Runtime, Debugger, Network } = crawler.client;

    Debugger.paused(async (params) => {

        let obj = await getVal_CDPCallFrame('h', params.callFrames, Runtime);
        console.log('headlesschrome2 ' + JSON.stringify(obj));

        Debugger.resume();
        crawler.client.close();
        // crawler.launcher.kill();
    });

    Debugger.scriptParsed((params) => {
        if ('http://finance.sina.com.cn/sinafinancesdk/js/chart/h5t.js' == params.url) {
            Debugger.getScriptSource({'scriptId': params.scriptId}, (err, msg) => {
                if (err) {
                    return;
                }

                let ci = msg.scriptSource.indexOf('window["KLC_ML_"+a]=null;');
                let loc = {
                    scriptId: params.scriptId,
                    lineNumber: 0,
                    columnNumber: ci
                };

                Debugger.setBreakpoint({location: loc}, (err, params1) => {
                    console.log("params1 : " + JSON.stringify(params1));
                });
            });
        }
    });

    await Promise.all([
        Page.enable(),
        Debugger.enable(),
        Network.enable()
    ]);

    await Page.navigate({url: crawler.options.uri});
    await Page.loadEventFired();

    return crawler;
}

let headlesschrome2Options = {
    typename: OPTIONS_TYPENAME,
    // 主地址
    uri: 'http://quotes.sina.cn/hs/company/quotes/view/sh600000/?from=wap',
    timeout: 30 * 1000,

    // 爬虫类型
    crawler_type: CRAWLER.HEADLESSCHROME,

    // 数据分析配置
    dataanalysis_type: DATAANALYSIS.NULL,

    // 分析数据
    func_analysis: func_analysis,

    headlesschromename: HEADLESSCHROME_NAME
};

function startHeadlessChrome2Crawler(code) {
    let op = Object.assign({}, headlesschrome2Options);
    op.uri = util.format('http://quotes.sina.cn/hs/company/quotes/view/%s/?from=wap', code);
    CrawlerMgr.singleton.addCrawler(op);
}

CrawlerMgr.singleton.regOptions(OPTIONS_TYPENAME, () => {
    let options = Object.assign({}, headlesschrome2Options);
    return options;
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

CrawlerMgr.singleton.processCrawlerNums = 8;
CrawlerMgr.singleton.processDelayTime = 0.3;

CrawlerMgr.singleton.init().then(() => {
    startHeadlessChrome2Crawler('sh600000');
    startHeadlessChrome2Crawler('sh600001');

    CrawlerMgr.singleton.start(true, true, async () => {
    }, true);
});
