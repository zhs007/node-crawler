"use strict";

const ChromeLauncher = require('chrome-launcher');
const chrome = require('chrome-remote-interface');
const fs = require('fs');
const { getVal_CDPCallFrame, logger } = require('../index');

var isend = false;

// const JSSRC = fs.readFileSync('samples/h5t.js', 'utf-8');

function launchChrome() {
    return ChromeLauncher.launch({
        port: 9222,
        autoSelectChrome: true,
        additionalFlags: ['--window-size=1136,640', '--disable-gpu', '--headless']
    });
}

launchChrome().then(launcher => {
    chrome(protocol => {
        const { Page, Runtime, Debugger, Network } = protocol;

        Promise.all([
            Page.enable(),
            Debugger.enable(),
            Network.enable()
        ]).then(() => {
            // protocol.on('Network.requestWillBeSent', (params) => {
            //     if ('http://finance.sina.com.cn/sinafinancesdk/js/chart/h5t.js' == params.request.url) {
            //         // console.log("got script ID", params.requestId);
            //         params.request.url = 'http://114.55.252.31/h5t.js';
            //     }
            // });

            // protocol.on('Network.responseReceived', (params) => {
            //     if ('http://finance.sina.com.cn/sinafinancesdk/js/chart/h5t.js' == params.response.url) {
            //         console.log("got script ID", params.requestId);
            //     }
            // });

            protocol.on('Debugger.paused', async (params) => {

                let obj = await getVal_CDPCallFrame('h', params.callFrames, Runtime);
                logger('info', 'getVal_CDPCallFrame ' + JSON.stringify(obj));

                Debugger.resume();
                protocol.close();
                launcher.kill();

                // for (let i = 0; i < params.callFrames.length; ++i) {
                //     let cf = params.callFrames[0];
                //     for (let j = 1; j < cf.scopeChain.length; ++j) {
                //         let csc = cf.scopeChain[j];
                //         Runtime.getProperties({objectId: csc.object.objectId}, (err, params1) => {
                //             console.log('obj:' + params1);
                //         });
                //
                //         return ;
                //     }
                // }

                // const code = "n;";
                //
                // Runtime.evaluate({expression: code}).then((result) => {
                //     console.log("haha", result);
                //     // protocol.close();
                //     // launcher.kill();
                // });

                //Debugger.resume();
            });

            protocol.on('Debugger.scriptParsed', (params) => {
                // Debugger.pause();

                logger('info', "got script ID", params.scriptId);
                logger('info', "got script ID", params.url);

                if ('http://finance.sina.com.cn/sinafinancesdk/js/chart/h5t.js' == params.url) {
                    // const code = "var td5 = 'haha';";

                    // Runtime.evaluate({expression: code}).then((result) => {
                    //     console.log("haha", result);
                    //     // protocol.close();
                    //     // launcher.kill();
                    // });

                    // Debugger.setScriptSource({'scriptId':params.scriptId, scriptSource: JSSRC, dryRun: true}, (err, msg) => {
                    //     console.log("script : " + JSON.stringify(msg));

                        Debugger.getScriptSource({'scriptId': params.scriptId}, (err, msg) => {
                            if (err) {
                                return;
                            }

                            let ci = msg.scriptSource.indexOf('window["KLC_ML_"+a]=null;');
                            let loc = {
                                scriptId: params.scriptId,
                                lineNumber: 0,
                                columnNumber: ci
                            };

                            Debugger.setBreakpoint({location: loc}, (err, params1) => {
                                logger('info', "params1 : " + JSON.stringify(params1));
                            });

                            // console.log("script : " + JSON.stringify(msg));

                            // if (!isend) {
                            //     //Page.reload();
                            //
                            //     isend = true;
                            // }

                            //Debugger.resume();
                            // if (msg.scriptSource.indexOf('TodayChart') >= 0) {
                            //     console.log("script OK!");
                            // }
                        });
                    // });
                }
                else {
                    //Debugger.resume();
                }

                // Debugger.getScriptSource({'scriptId':params.scriptId}, (err, msg) => {
                //     if (err) {
                //         return;
                //     }
                //
                //     console.log("script : " + JSON.stringify(msg));
                //     if (msg.scriptSource.indexOf('hq_str_ml') >= 0) {
                //         console.log("script OK!");
                //     }
                // });
            });
            // chrome.on('Debugger.scriptParsed', (params) => {
            //     console.log("got script ID", params.scriptId);
            // });

            Page.navigate({url: 'http://quotes.sina.cn/hs/company/quotes/view/sh600000/?from=wap'});
            Page.loadEventFired(() => {

                // setInterval(() => {
                //     const code = "td5;";
                //
                //     Runtime.evaluate({expression: code}).then((result) => {
                //         console.log("haha", result);
                //         // protocol.close();
                //         // launcher.kill();
                //     });
                // }, 1000);
            });
        });
    }).on('error', err => {
        throw Error('connect chrome err:' + err);
    }).on('Debugger.scriptParsed', (params) => {
        logger('info', "got script ID", params.scriptId);
    });
});