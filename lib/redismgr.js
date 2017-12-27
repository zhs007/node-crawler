"use strict";

const Redis = require('ioredis');
const { logger } = require('./util');

class RedisMgr {

    constructor() {
        this.mapRedisConn = {};
        this.mapCfg = {};
    }

    addCfg(redisid, cfg) {
        this.mapCfg[redisid] = cfg;
    }

    getRedisConn(redisid) {
        if (this.mapRedisConn.hasOwnProperty(redisid)) {
            return this.mapRedisConn[redisid];
        }

        return undefined;
    }

    async __newRedisConn(cfg) {
        return new Promise((resolve, reject) => {
            let redisconn = new Redis(cfg);

            redisconn.on("connect", function () {
                resolve(redisconn);
            });

            redisconn.on("error", function (err) {
                logger('error', 'RedisMgr() redis err ' + JSON.stringify(cfg) + ' err ' + JSON.stringify(err));

                reject(err);
            });
        });
    }

    async start() {
        for (let key in this.mapCfg) {
            try {
                this.mapRedisConn[key] = await this.__newRedisConn(this.mapCfg[key]);

                logger('info', 'RedisMgr.start() conn ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' ok!');
            }
            catch (err) {
                logger('error', 'RedisMgr.start() conn ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' err ' + JSON.stringify(err));
            }
        }
    }
};

RedisMgr.singleton = new RedisMgr();

exports.RedisMgr = RedisMgr;