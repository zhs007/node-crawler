"use strict";

const ChromeLauncher = require('chrome-launcher');

class HeadlessChromeMgr {
    constructor() {
        this.mapLauncher = {};
        this.mapOption = {};
    }

    addHeadlessChrome(name, option) {
        this.killLauncher(name);

        this.mapOption[name] = option;
    }

    async getHeadlessChrome(name) {
        if (this.mapLauncher[name] == undefined) {
            this.mapLauncher[name] = await ChromeLauncher.launch(this.mapOption[name]);
        }

        return this.mapLauncher[name];
    }

    async killLauncher(name) {
        if (this.mapLauncher[name] != undefined) {
            await this.mapLauncher[name].kill();

            this.mapLauncher[name] = undefined;
        }
    }
}

HeadlessChromeMgr.singleton = new HeadlessChromeMgr();

exports.HeadlessChromeMgr = HeadlessChromeMgr;