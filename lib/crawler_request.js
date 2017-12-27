"use strict";

const { CRAWLER } = require('./basedef');
const { log } = require('./util');
const Crawler = require('./crawler').Crawler;
const CrawlerMgr = require('./crawlermgr');
const rp = require('request-promise');
const iconv = require('iconv-lite');
const moment = require('moment');

class Crawler_Request extends Crawler {

    constructor(options) {
        super(options);

        options.encoding = null;
        options.resolveWithFullResponse = true;
    }

    async start() {
        await rp(this.options)
            .then(data => {
                log('info', 'Crawler_Request ' + this.options.uri + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

                this.onProcess(data);
            })
            .catch(err => {
                log('error', 'Crawler_Request error ' + err + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
                if (err.error.code === 'ETIMEDOUT' || err.error.code === 'ESOCKETTIMEDOUT') {
                    CrawlerMgr.singleton.addCrawler(this.options);
                }

                this.onError(err);
            });

        if (this.data == undefined) {
            return undefined;
        }

        return this;
    }

    onProcess(data) {
        if (this.options.force_encoding == 'gbk' || this.options.force_encoding == 'GBK') {
            super.onProcess(iconv.decode(data.body, 'gbk'));
        }
        else if (data.headers['content-type'].indexOf('GB2312') >= 0 ||
            data.headers['content-type'].indexOf('GBK') >= 0 ||
            data.headers['content-type'].indexOf('gb2312') >= 0 ||
            data.headers['content-type'].indexOf('gbk') >= 0) {
            super.onProcess(iconv.decode(data.body, 'gbk'));
        }
        else if (this.options.force_encoding == 'binary') {
            super.onProcess(data.body);
        }
        else {
            super.onProcess(data.body.toString());
        }
    }
};

CrawlerMgr.singleton.regCrawler(CRAWLER.REQUEST, function (options) {
    return new Crawler_Request(options);
});

exports.Crawler_Request = Crawler_Request;