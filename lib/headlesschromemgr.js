"use strict";

const ChromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

class HeadlessChromeMgr {
    constructor() {
        this.mapLauncher = {};
        this.mapOption = {};
    }

    addHeadlessChrome(name, option) {
        this.killLauncher(name);

        this.mapOption[name] = option;
    }

    getOption(name) {
        return this.mapOption[name];
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

    async closeTab(client) {
        const id = client.target.id;
        CDP.Close({id});
    }
}

HeadlessChromeMgr.singleton = new HeadlessChromeMgr();

exports.HeadlessChromeMgr = HeadlessChromeMgr;