"use strict";

const CRAWLER = {
    REQUEST: 'request',
    HEADLESSCHROME: 'headlesschrome',
};

const DATAANALYSIS = {
    NULL: 'null',
    CHEERIO: 'cheerio',
    JAVASCRIPT: 'javascript',
    JSON: 'json',
    XML: 'xml'
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
    REDIS: 'redis',
};

const CRAWLEROPTIONS = {
    DEFAULT: 'default',
};

exports.CRAWLER         = CRAWLER;
exports.DATAANALYSIS    = DATAANALYSIS;
exports.STORAGE         = STORAGE;
exports.CRAWLERCACHE    = CRAWLERCACHE;
exports.CRAWLEROPTIONS  = CRAWLEROPTIONS;