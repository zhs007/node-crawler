"use strict";

require('./lib/crawler_request');
require('./lib/crawler_headlesschrome');

require('./lib/da_cheerio');
require('./lib/da_js');
require('./lib/da_json');
require('./lib/da_xml');

require('./lib/storage');
require('./lib/storage_csv');
require('./lib/storage_json');
require('./lib/storage_sql');
require('./lib/storage_mysql');

require('./lib/crawlercache');
require('./lib/crawlercache_redis');

require('./lib/crawleroptions_default');

let { CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE, CRAWLEROPTIONS, HEADLESSCHROMETYPE } = require('./lib/basedef');
let CrawlerMgr = require('./lib/crawlermgr');

// options
//      - typename: string union
//      - uri: string or string array
//      - force_encoding: default utf8
//      - timeout: request timeout
//      - async func_analysis(crawler)
//      - async func_onfinish(crawler)
//      - func_getcache()
//      - func_setcache(cache)
//      - crawler_type: CRAWLER.REQUEST ...
//      - dataanalysis_type: DATAANALYSIS.CHEERIO ...
//      - storage_type: STORAGE.CSV ...
//      - storage_cfg
//          - storage_cfg for csv {filename}
//          - storage_cfg for json {filename}
//          - storage_cfg for sql {filename, func_procline(lineobj)}
//          - storage_cfg for mysql {func_procline(lineobj), mysqlcfg: {host, user, password, database}}
//      - headlesschromename: headlesschrome name from HeadlessChromeMgr
//      - headlesschrometype: HEADLESSCHROMETYPE

exports.CRAWLER = CRAWLER;
exports.DATAANALYSIS = DATAANALYSIS;
exports.STORAGE = STORAGE;
exports.CRAWLERCACHE = CRAWLERCACHE;
exports.CRAWLEROPTIONS = CRAWLEROPTIONS;
exports.HEADLESSCHROMETYPE = HEADLESSCHROMETYPE;

exports.CrawlerMgr = CrawlerMgr;

let RedisMgr = require('./lib/redismgr');
let MysqlMgr = require('./lib/mysqlmgr');

exports.RedisMgr = RedisMgr;
exports.MysqlMgr = MysqlMgr;

let { getVal_CDPCallFrame, getDocumentText_CDP, getDocumentHtml_CDP, toXMLString } = require('./lib/util');

exports.getVal_CDPCallFrame = getVal_CDPCallFrame;
exports.getDocumentText_CDP = getDocumentText_CDP;
exports.getDocumentHtml_CDP = getDocumentHtml_CDP;
exports.toXMLString = toXMLString;

let { HeadlessChromeMgr } = require('./lib/headlesschromemgr');

exports.HeadlessChromeMgr = HeadlessChromeMgr;