"use strict";

const CrawlerMgr = require('./crawlermgr');
const { CRAWLER, DATAANALYSIS, CRAWLEROPTIONS } = require('./basedef');

async function func_analysis(crawler) {
    return crawler;
}

// function func_getcache(options) {
//     return {
//         uri: options.uri,
//         timeout: options.timeout,
//         crawler_type: options.crawler_type,
//         dataanalysis_type: options.dataanalysis_type,
//     };
// }
//
// function func_setcache(options, cache) {
//     options.uri = cache.uri;
//     options.timeout = cache.timeout;
//     options.crawler_type = cache.crawler_type;
//     options.dataanalysis_type = cache.dataanalysis_type;
// }

let defaultOptions = {
    typename: CRAWLEROPTIONS.DEFAULT,
    uri: '',
    timeout: 30 * 1000,
    crawler_type: CRAWLER.REQUEST,
    dataanalysis_type: DATAANALYSIS.NULL,
    func_analysis: func_analysis,
};

CrawlerMgr.singleton.regOptions(CRAWLEROPTIONS.DEFAULT, () => {
    let options = Object.assign({}, defaultOptions);
    return options;
});

exports.defaultOptions = defaultOptions;