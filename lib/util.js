"use strict";

let mysql = require('mysql2/promise');

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
    let mysqlconn = mysql.createConnection(cfg);
    mysqlconn.cfg = cfg;

    mysqlconn.on('error', async (err) => {
        await onMysql2Error(mysqlconn, err);
    });
}

exports.createMysql2 = createMysql2;