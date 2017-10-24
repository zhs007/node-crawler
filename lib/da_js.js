"use strict";

let {DATAANALYSIS} = require('./basedef');
let DataAnalysis = require('./dataanalysis').DataAnalysis;
let CrawlerMgr = require('./crawlermgr');
const vm = require('vm');

class DA_JS extends DataAnalysis {

    constructor(crawler) {
        super(crawler);
    }

    async onAnalysis() {
        this.context = {
            vm: vm
        };

        vm.createContext(this.context);
        this.data = this.crawler.data;
        vm.runInContext(this.data, this.context);

        return this;
    }

    runScript(code) {
        vm.runInContext(code, this.context);
    }
};

CrawlerMgr.singleton.regDataAnalysis(DATAANALYSIS.JAVASCRIPT, function (crawler) {
    return new DA_JS(crawler);
});

exports.DA_JS = DA_JS;