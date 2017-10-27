"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLEROPTIONS } = require('./basedef');

async function func_analysis(crawler) {
    return crawler;
}

function func_getcache(options) {
    return {
        uri: options.uri,
        timeout: options.timeout,
        crawler_type: options.crawler_type,
        dataanalysis_type: options.dataanalysis_type,
    };
}

function func_setcache(options, cache) {
    options.uri = cache.uri;
    options.timeout = cache.timeout;
    options.crawler_type = cache.crawler_type;
    options.dataanalysis_type = cache.dataanalysis_type;
}

let defaultOptions = {
    typename: CRAWLEROPTIONS.DEFAULT,
    // 主地址
    uri: '',
    timeout: 30 * 1000,

    // 爬虫类型
    crawler_type: CRAWLER.REQUEST,

    // 数据分析配置
    dataanalysis_type: DATAANALYSIS.CHEERIO,

    func_analysis: func_analysis,
    func_getcache: func_getcache,
    func_setcache: func_setcache,
};

CrawlerMgr.singleton.regOptions(CRAWLEROPTIONS.DEFAULT, () => {
    let options = Object.assign({}, defaultOptions);
    return options;
});

exports.defaultOptions = defaultOptions;

exports.func_getcache = func_getcache;
exports.func_setcache = func_setcache;