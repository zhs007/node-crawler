"use strict";

const mysql = require('mysql2/promise');
const { logger } = require('./util');

class MysqlMgr {
    constructor() {
        this.mapMysqlConn = {};
        this.mapCfg = {};
    }

    addCfg(mysqlid, cfg) {
        this.mapCfg[mysqlid] = cfg;
    }

    getMysqlConn(mysqlid) {
        if (this.mapMysqlConn.hasOwnProperty(mysqlid)) {
            return this.mapMysqlConn[mysqlid];
        }

        return undefined;
    }

    async start() {
        for (let key in this.mapCfg) {
            try {
                this.mapMysqlConn[key] = await mysql.createConnection(this.mapCfg[key]);

                this.mapMysqlConn[key].on('error',async (err) => {
                    await this.onError(key, err);
                });

                logger.log('info', 'MysqlMgr.start() conn ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' ok!');
            }
            catch (err) {
                logger.log('error', 'MysqlMgr.start() conn ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' err ' + JSON.stringify(err));
            }
        }
    }

    // 根据错误处理重连，如果该函数返回true，应该不是语法错误，建议重试一次
    // 如果重试，conn最好重新取一次
    async onError(key, err) {
        logger.log('error', 'MysqlMgr.onError() conn ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' err ' + JSON.stringify(err));
        if (err.code == 'ETIMEDOUT' || err.code == 'ECONNRESET' || err.code == 'ECONNREFUSED' || err.code == 'PROTOCOL_CONNECTION_LOST' ||
            err.code == 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code == 'ETIMEDOUT') {

            try {
                //await this.mapMysqlConn[key].end();
                this.mapMysqlConn[key] = await mysql.createConnection(this.mapCfg[key]);
            }
            catch (err) {
                logger.log('error', 'MysqlMgr.onError() reconnect failed. ' + key + ':' + JSON.stringify(this.mapCfg[key]) + ' err ' + JSON.stringify(err));
            }

            return true;
        }

        return false;
    }
};

MysqlMgr.singleton = new MysqlMgr();

exports.MysqlMgr = MysqlMgr;