"use strict";

const expat = require('node-expat');
var winston = require('winston');
// require('winston-daily-rotate-file');

// default logger is only console
var logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console()
    ]
});

function log(level, msg) {
    logger.log(level, msg);
}

async function getVal_CDPObjectValue(valobj, Runtime) {
    if (valobj.type == 'string' || valobj.type == 'boolean' || valobj.type == 'number') {
        return valobj.value;
    }
    else if (valobj.type == 'object') {
        if (valobj.hasOwnProperty('subtype')) {
            if (valobj.subtype == 'null') {
                return null;
            }
            else if (valobj.subtype == 'array') {
                return await getVal_CDPObject(undefined, valobj.objectId, Runtime);
            }
            else if (valobj.subtype == 'date') {
                return valobj.description;
                // return await getVal_CDPObject(undefined, valobj.objectId, Runtime);
            }
            else {
                log('debug', 'getVal_CDPObject subtype ' + JSON.stringify(valobj));
            }
        }
        else if (valobj.hasOwnProperty('className')) {
            if (valobj.className == 'Object') {
                return await getVal_CDPObject(undefined, valobj.objectId, Runtime);
            }
            else {
                log('debug', 'getVal_CDPObject className ' + JSON.stringify(valobj));
            }
        }
        else {
            log('debug', 'getVal_CDPObject object ' + JSON.stringify(valobj));
        }
    }
    else if (valobj.type == 'function') {
        return undefined;
    }
    else {
        log('debug', 'getVal_CDPObject type ' + JSON.stringify(valobj));
    }

    return undefined;
}

async function getVal_CDPObject(valname, objid, Runtime) {
    return new Promise((resolve, reject) => {
        Runtime.getProperties({objectId: objid}, async (err, params) => {
            if (err) {
                reject(params);

                return ;
            }

            if (valname == undefined) {
                if (Array.isArray(params.result)) {
                    let curobj = {};

                    for (let i = 0; i < params.result.length; ++i) {
                        let co = params.result[i];
                        if (co.name == '__proto__') {
                            continue;
                        }

                        let cov = await getVal_CDPObjectValue(co.value, Runtime);
                        if (cov != undefined) {
                            curobj[co.name] = cov;
                        }
                    }

                    resolve(curobj);

                    return ;
                }

                resolve(await getVal_CDPObjectValue(co.value, Runtime));

                return ;
            }
            else {
                if (Array.isArray(params.result)) {
                    for (let i = 0; i < params.result.length; ++i) {
                        let co = params.result[i];
                        if (co.name == valname) {
                            resolve(await getVal_CDPObjectValue(co.value, Runtime));

                            return ;
                        }
                    }
                }
            }

            resolve(undefined);
        });
    });
}

async function getVal_CDPScopeChain(valname, lstsc, Runtime) {
    for (let i = 0; i < lstsc.length; ++i) {
        let csc = lstsc[i];
        let co = await getVal_CDPObject(valname, csc.object.objectId, Runtime);
        if (co != undefined) {
            return co;
        }
        // console.log(co);
    }

    return undefined;
}

async function getVal_CDPCallFrame(valname, lstcf, Runtime) {
    for (let i = 0; i < lstcf.length; ++i) {
        let cf = lstcf[0];
        return await getVal_CDPScopeChain(valname, lstcf[0].scopeChain, Runtime);
    }

    return undefined;
}

async function getDocumentText_CDP(url, client) {
    const { Page, Runtime } = client;
    await Page.enable();
    await Page.addScriptToEvaluateOnNewDocument({source: 'function alert(str) { console.log(str); }'});
    await Page.navigate({url: url});
    await Page.loadEventFired();
    const result = await Runtime.evaluate({
        expression: 'document.documentElement.outerText'
    });
    return result.result.value;
}

async function getDocumentHtml_CDP(url, client) {
    const { Page, Runtime } = client;
    await Page.enable();
    await Page.addScriptToEvaluateOnNewDocument({source: 'function alert(str) { console.log(str); }'});
    await Page.navigate({url: url});
    await Page.loadEventFired();
    const result = await Runtime.evaluate({
        expression: 'document.documentElement.outerHTML'
    });
    return result.result.value;
}

function toXMLString(node) {
    if (node.hasOwnProperty('_name') && node.hasOwnProperty('_attr') && node.hasOwnProperty('_parentnode') &&
        node.hasOwnProperty('_lstchild')) {
        let str = '<' + node._name;
        for (let attrname in node._attr) {
            str += ' ' + attrname + '="' + node._attr[attrname] + '"';
        }
        str += '>';

        if (node.hasOwnProperty('_text')) {
            str += node._text;
        }

        for (let ii = 0; ii < node._lstchild.length; ++ii) {
            str += toXMLString(node._lstchild[ii]);
        }

        str += '</' + node._name + '>';

        return str;
    }

    return '';
}

function parseXML(str) {
    let root = {
        _name: '',
        _attr: {},
        _parentnode: null,
        _lstchild: []
    };

    let curnode = undefined;
    let parser = new expat.Parser('UTF-8');

    parser.on('startElement', (name, attrs) => {
        if (curnode == undefined) {
            curnode = root;

            curnode._name = name;
            curnode._attr = attrs;
        }
        else {
            let cn = {
                _name: name,
                _attr: attrs,
                _parentnode: curnode,
                _lstchild: []
            };

            curnode._lstchild.push(cn);

            curnode = cn;
        }
    });

    parser.on('endElement', (name) => {
        if (curnode != undefined && curnode != null) {
            curnode = curnode._parentnode;
        }
    });

    parser.on('text', (text) => {
        if (curnode != undefined && curnode != null) {
            curnode._text = text;
        }
    });

    parser.on('processingInstruction', (target, data) => {
        log('debug', 'processingInstruction', target, data);
    });

    parser.on('comment', (s) => {
        log('debug', 'comment', s);
    });

    parser.on('xmlDecl', (version, encoding, standalone) => {
        log('debug', 'xmlDecl', version, encoding, standalone);
    });

    parser.on('startCdata', () => {
        log('debug', 'startCdata');
    });

    parser.on('endCdata', () => {
        log('debug', 'endCdata');
    });

    parser.on('entityDecl', (entityName, isParameterEntity, value, base, systemId, publicId, notationName) => {
        log('debug', 'entityDecl', entityName, isParameterEntity, value, base, systemId, publicId, notationName);
    });

    parser.on('error', (error) => {
        log('error', error);
    });

    parser.write(str);

    return root;
}

function addChildNodeXML(destnode, srcnode) {
    srcnode._parentnode = destnode;

    destnode._lstchild.push(srcnode);

    return destnode;
}

function initDailyRotateFileLog(path, level = 'info') {
    // let transport = new (winston.transports.DailyRotateFile)({
    //     filename: path,
    //     datePattern: 'yyyy-MM-dd.',
    //     prepend: true,
    //     level: level
    // });

    // const DailyRotateFile = require('winston-daily-rotate-file');
    // logger.configure({
    //     level: level,
    //     transports: [
    //         new DailyRotateFile({
    //             filename: path,
    //             datePattern: 'yyyy-MM-dd.',
    //             prepend: true,
    //             level: level
    //         })
    //     ]
    // });

    logger = winston.createLogger({
        level: level,
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: path })
        ]
    });
}

// obj is like logger.log(level, msg)
function setLogger(obj) {
    logger = obj;
}

exports.getVal_CDPCallFrame = getVal_CDPCallFrame;
exports.getDocumentText_CDP = getDocumentText_CDP;
exports.getDocumentHtml_CDP = getDocumentHtml_CDP;
exports.toXMLString = toXMLString;
exports.parseXML = parseXML;
exports.addChildNodeXML = addChildNodeXML;
exports.initDailyRotateFileLog = initDailyRotateFileLog;
exports.setLogger = setLogger;
exports.log = log;