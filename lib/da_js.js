"use strict";

const { DATAANALYSIS } = require('./basedef');
const DataAnalysis = require('./dataanalysis').DataAnalysis;
const CrawlerMgr = require('./crawlermgr');
const vm = require('vm');

class DA_JS extends DataAnalysis {

    constructor(crawler) {
        super(crawler);
    }

    async onAnalysis() {
        this.context = {
            crawler: this.crawler
        };

        vm.createContext(this.context);
        this.data = this.crawler.data;
        // vm.runInContext(this.data, this.context);

        return this;
    }

    runScript(code) {
        vm.runInContext(code, this.context);
    }

    runCurCode() {
        vm.runInContext(this.data, this.context);
    }
};

CrawlerMgr.singleton.regDataAnalysis(DATAANALYSIS.JAVASCRIPT, function (crawler) {
    return new DA_JS(crawler);
});

exports.DA_JS = DA_JS;