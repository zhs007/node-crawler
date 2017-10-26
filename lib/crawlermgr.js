"use strict";

const { CRAWLER, DATAANALYSIS, STORAGE, CRAWLERCACHE } = require('./basedef');
const { CrawlerOptionsMgr } = require('./crawleroptionsmgr');
const { RedisMgr } = require('./redismgr');
const { MysqlMgr } = require('./mysqlmgr');
const heapdump = require('heapdump');
const memwatch = require('memwatch-next');
const process = require('process');
const moment = require('moment');

class CrawlerMgr {

    constructor() {
        this.mapCrawler = {};
        this.mapDA = {};
        this.mapStorage = {};
        this.mapCrawlerCache = {};

        this.lstCrawler = [];
        this.lstCrawlerRuning = [];
        this.processCrawlerNums = 1;    // 同时处理的任务数量
        this.processDelayTime = 30;     // 每个任务处理间隔时间，秒

        this.timerOnIdle = undefined;

        this.autoStop = false;          // 是否自动stop，队列为空就stop
        this.autoExitOnStop = false;    // stop时是否自动退出

        this.funcOnStop = undefined;
        this.isAsync_funcOnStop = false;

        this.crawlercache = undefined;
        this.crawleroptionsmgr = new CrawlerOptionsMgr();
    }

    // funcNew(options)
    regCrawler(crawlertype, funcNew) {
        this.mapCrawler[crawlertype] = funcNew;
    }

    // funcNew(crawler)
    regDataAnalysis(datype, funcNew) {
        this.mapDA[datype] = funcNew;
    }

    // funcNew(crawler)
    regStorage(storagetype, funcNew) {
        this.mapStorage[storagetype] = funcNew;
    }

    // funcNew(cfg)
    regCrawlerCache(crawlercachetype, funcNew) {
        this.mapCrawlerCache[crawlercachetype] = funcNew;
    }

    // funcNew(cache)
    regOptions(typename, funcNew) {
        this.crawleroptionsmgr.regOptions(typename, funcNew);
    }

    setCrawlerCache(type, cfg) {
        if (this.mapCrawlerCache.hasOwnProperty(type)) {
            this.crawlercache = this.mapCrawlerCache[type](cfg);
        }
    }

    addRedisCfg(redisid, cfg) {
        RedisMgr.singleton.addCfg(redisid, cfg);
    }

    addMysqlCfg(mysqlid, cfg) {
        MysqlMgr.singleton.addCfg(mysqlid, cfg);
    }

    getRedisConn(redisid) {
        return RedisMgr.singleton.getRedisConn(redisid);
    }

    getMysqlConn(mysqlid) {
        return MysqlMgr.singleton.getMysqlConn(mysqlid);
    }

    async init() {
        await RedisMgr.singleton.start();
        await MysqlMgr.singleton.start();

        if (this.crawlercache != undefined) {
            await this.crawlercache.init();
        }
    }

    async _startCrawler(crawler) {
        this.lstCrawlerRuning.push(crawler);

        console.log('start crawler ' + crawler.options.uri + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        console.log('last crawler nums is ' + this.lstCrawler.length);

        await crawler.start().then(async crawler => {
            if (crawler != undefined) {
                if (crawler.options.dataanalysis_type != DATAANALYSIS.NULL) {
                    let da = this.mapDA[crawler.options.dataanalysis_type](crawler);
                    da.onAnalysis();
                }

                if (crawler.options.func_analysis != undefined) {
                    await crawler.options.func_analysis(crawler);
                }
            }

            return ;
        });

        console.log('end crawler ' + crawler.options.uri);

        let ci = this.lstCrawlerRuning.indexOf(crawler);
        if (ci >= 0) {
            this.lstCrawlerRuning.splice(ci, 1);
        }

        crawler = undefined;

        return ;
    }

    async _addCrawler_UriArr(options) {
        if (Array.isArray(options.uri)) {
            for (let i = 0; i < options.uri.length; ++i) {
                let op = Object.assign({}, options);
                op.uri = options.uri[i];
                await this.addCrawler(op);
            }
        }
    }

    _addCrawler_nocache(options) {
        let crawlertype = CRAWLER.REQUEST;
        let datype = DATAANALYSIS.NULL;
        let storagetype = STORAGE.NULL;

        if (options.hasOwnProperty('crawler_type')) {
            crawlertype = options.crawler_type;
        }
        else {
            options.crawler_type = crawlertype;
        }

        if (options.hasOwnProperty('dataanalysis_type')) {
            datype = options.dataanalysis_type;
        }
        else {
            options.dataanalysis_type = datype;
        }

        if (options.hasOwnProperty('storage_type')) {
            storagetype = options.storage_type;
        }
        else {
            options.storage_type = storagetype;
        }

        let crawler = this.mapCrawler[crawlertype](options);
        let storage = this.mapStorage[storagetype](crawler);

        this.lstCrawler.push(crawler);
    }

    async _addCrawler_cache(options) {
        let cache = options.func_getcache();
        await this.crawlercache.addCache(cache);
    }

    // start Crawler
    async addCrawler(options) {
        if (Array.isArray(options.uri)) {
            await this._addCrawler_UriArr(options);

            return ;
        }

        let is2cache = true;

        if (this.crawlercache == undefined) {
            is2cache = false;
        }

        if (!(options.hasOwnProperty('func_getcache') && options.hasOwnProperty('func_setcache'))) {
            is2cache = false;
        }

        if (!is2cache) {
            this._addCrawler_nocache(options);
        }
        else {
            await this._addCrawler_cache(options);
        }

        return ;
    }

    async _onIdle_cache() {
        if (this.lstCrawler.length <= 0) {
            let cache = await this.crawlercache.getCache();
            if (cache != undefined) {
                let options = this.crawleroptionsmgr.newOptions(cache);
                if (options == undefined) {
                    this.crawlercache.addCache(cache);
                }
                else {
                    this._addCrawler_nocache(options);
                }
            }
        }
    }

    async _onIdle() {
        if (this.crawlercache != undefined) {
            await this._onIdle_cache();
        }

        if (this.lstCrawler.length <= 0) {
            if (this.autoStop) {
                if (this.lstCrawlerRuning.length <= 0) {
                    this.stop();
                }
            }

            return ;
        }

        let crawler = this.lstCrawler[0];
        if (this.lstCrawlerRuning.length < this.processCrawlerNums) {
            this.lstCrawler.splice(0, 1);

            this._startCrawler(crawler);
        }

        return ;
    }

    start(autoStop, autoExitOnStop, funcOnStop, isAsync_funcOnStop) {
        if (isAsync_funcOnStop == undefined) {
            isAsync_funcOnStop = false;
        }

        this.stop();

        this.autoStop = autoStop;
        this.autoExitOnStop = autoExitOnStop;
        this.funcOnStop = funcOnStop;
        this.isAsync_funcOnStop = isAsync_funcOnStop;

        this.timerOnIdle = setInterval(() => {
            this._onIdle();
        }, this.processDelayTime * 1000);
    }

    stop() {
        if (this.timerOnIdle != undefined) {
            clearInterval(this.timerOnIdle);

            this.timerOnIdle = undefined;

            if (this.funcOnStop != undefined) {
                if (this.isAsync_funcOnStop) {
                    this.funcOnStop().then(() => {
                        if (this.autoExitOnStop) {
                            process.exit(0);
                        }
                    });
                }
                else {
                    this.funcOnStop();

                    if (this.autoExitOnStop) {
                        process.exit(0);
                    }
                }
            }
            else {
                if (this.autoExitOnStop) {
                    process.exit(0);
                }
            }
        }
    }

    hasCrawler(uri) {
        for (let ii = 0; ii < this.lstCrawlerRuning.length; ++ii) {
            if (uri == this.lstCrawlerRuning[ii].options.uri) {
                return true;
            }
        }

        for (let ii = 0; ii < this.lstCrawler.length; ++ii) {
            if (uri == this.lstCrawler[ii].options.uri) {
                return true;
            }
        }

        return false;
    }

    startHeapdump(timeOff) {
        setInterval(() => {
            heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
        }, timeOff);
    }

    startMemWatch() {
        memwatch.on('leak', info => {
            console.log(info);

            let hd = new memwatch.HeapDiff();
            let diff = hd.end();

            console.log(diff);
        });

        memwatch.on('stats', stats => {
            console.log(stats);
        });
    }
};

exports.singleton = new CrawlerMgr();