"use strict";

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
                console.log('getVal_CDPObject subtype ' + JSON.stringify(valobj));
            }
        }
        else if (valobj.hasOwnProperty('className')) {
            if (valobj.className == 'Object') {
                return await getVal_CDPObject(undefined, valobj.objectId, Runtime);
            }
            else {
                console.log('getVal_CDPObject className ' + JSON.stringify(valobj));
            }
        }
        else {
            console.log('getVal_CDPObject object ' + JSON.stringify(valobj));
        }
    }
    else if (valobj.type == 'function') {
        return undefined;
    }
    else {
        console.log('getVal_CDPObject type ' + JSON.stringify(valobj));
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
    await Page.navigate({url: url});
    await Page.loadEventFired();
    const result = await Runtime.evaluate({
        expression: 'document.documentElement.outerText'
    });
    return result.result.value;
}

exports.getVal_CDPCallFrame = getVal_CDPCallFrame;
exports.getDocumentText_CDP = getDocumentText_CDP;