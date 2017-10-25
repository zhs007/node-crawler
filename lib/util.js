"use strict";

const mysql = require('mysql2/promise');
const Redis = require('ioredis');

async function onMysql2Error(mysqlconn, err) {
    console.log('onMysql2Error() ' + JSON.stringify(mysqlconn.cfg) + ' err ' + JSON.stringify(err));

    if (err.code == 'ETIMEDOUT' || err.code == 'ECONNRESET' || err.code == 'ECONNREFUSED' || err.code == 'PROTOCOL_CONNECTION_LOST' || err.code == 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code == 'ETIMEDOUT') {
        try {
            await mysqlconn.end();
            await mysqlconn.connect();
        }
        catch (err) {
            console.log('onMysql2Error() reconnect failed. ' + JSON.stringify(mysqlconn.cfg) + ' err ' + JSON.stringify(err));
        }

        return true;
    }
}

async function createMysql2(cfg) {
    let mysqlconn = await mysql.createConnection(cfg);
    mysqlconn.cfg = cfg;

    mysqlconn.on('error', async (err) => {
        await onMysql2Error(mysqlconn, err);
    });
}

async function createRedis(cfg) {
    return new Promise((resolve, reject) => {
        let redisconn = new Redis(cfg);

        redisconn.on("connect", function () {
            resolve(redisconn);
        });

        redisconn.on("error", function (err) {
            console.log('createRedis() redis err ' + JSON.stringify(cfg) + ' err ' + JSON.stringify(err));

            reject(err);
        });
    });
}

exports.createMysql2 = createMysql2;
exports.createRedis = createRedis;