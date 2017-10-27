"use strict";

require('./lib/crawler_request');
require('./lib/crawler_headlesschrome');

require('./lib/da_cheerio');
require('./lib/da_js');

require('./lib/storage');
require('./lib/storage_csv');
require('./lib/storage_json');
require('./lib/storage_sql');
require('./lib/storage_mysql');

require('./lib/crawlercache');
require('./lib/crawlercache_redis');

require('./lib/crawleroptions_default');

let { CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE, CRAWLEROPTIONS } = require('./lib/basedef');
let CrawlerMgr = require('./lib/crawlermgr');

// options
//      - typename: string union
//      - uri: string or string array
//      - force_encoding: default utf8
//      - timeout: request timeout
//      - async func_analysis(crawler)
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

exports.CRAWLER = CRAWLER;
exports.DATAANALYSIS = DATAANALYSIS;
exports.STORAGE = STORAGE;
exports.CRAWLERCACHE = CRAWLERCACHE;
exports.CRAWLEROPTIONS = CRAWLEROPTIONS;

exports.CrawlerMgr = CrawlerMgr;

let RedisMgr = require('./lib/redismgr');
let MysqlMgr = require('./lib/mysqlmgr');

exports.RedisMgr = RedisMgr;
exports.MysqlMgr = MysqlMgr;
