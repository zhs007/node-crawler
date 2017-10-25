"use strict";

const CRAWLER = {
    REQUEST: 'request',
    HEADLESSCHROME: 'headlesschrome',
};

const DATAANALYSIS = {
    NULL: 'null',
    CHEERIO: 'cheerio',
    JAVASCRIPT: 'javascript',
};

const STORAGE = {
    NULL: 'null',
    MYSQL: 'mysql',
    CSV: 'csv',
    EXCEL: 'excel',
    SQL: 'sql',
    JSON: 'json',
};

const CRAWLERCACHE = {
    NULL: 'null',
    MYSQL: 'redis',
};

exports.CRAWLER         = CRAWLER;
exports.DATAANALYSIS    = DATAANALYSIS;
exports.STORAGE         = STORAGE;
exports.CRAWLERCACHE    = CRAWLERCACHE;