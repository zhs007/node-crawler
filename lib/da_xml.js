"use strict";

const { DATAANALYSIS } = require('./basedef');
const DataAnalysis = require('./dataanalysis').DataAnalysis;
const CrawlerMgr = require('./crawlermgr');
const { parseXML } = require('./util');

class DA_XML extends DataAnalysis {

    constructor(crawler) {
        super(crawler);

        this.root = undefined;
    }

    async onAnalysis() {
        this.data = this.crawler.data;

        this.root = parseXML(this.data);

        // this.root = {
        //     _name: '',
        //     _attr: {},
        //     _parentnode: null,
        //     _lstchild: []
        // };
        //
        // let curnode = undefined;
        //
        // let parser = new expat.Parser('UTF-8');
        //
        // parser.on('startElement', (name, attrs) => {
        //     if (curnode == undefined) {
        //         curnode = this.root;
        //
        //         curnode._name = name;
        //         curnode._attr = attrs;
        //     }
        //     else {
        //         let cn = {
        //             _name: name,
        //             _attr: attrs,
        //             _parentnode: curnode,
        //             _lstchild: []
        //         };
        //
        //         curnode._lstchild.push(cn);
        //
        //         curnode = cn;
        //     }
        // });
        //
        // parser.on('endElement', (name) => {
        //     if (curnode != undefined && curnode != null) {
        //         curnode = curnode._parentnode;
        //     }
        // });
        //
        // parser.on('text', (text) => {
        //     if (curnode != undefined && curnode != null) {
        //         curnode._text = text;
        //     }
        // });
        //
        // parser.on('processingInstruction', (target, data) => {
        //     console.log('processingInstruction', target, data);
        // });
        //
        // parser.on('comment', (s) => {
        //     console.log('comment', s);
        // });
        //
        // parser.on('xmlDecl', (version, encoding, standalone) => {
        //     console.log('xmlDecl', version, encoding, standalone);
        // });
        //
        // parser.on('startCdata', () => {
        //     console.log('startCdata');
        // });
        //
        // parser.on('endCdata', () => {
        //     console.log('endCdata');
        // });
        //
        // parser.on('entityDecl', (entityName, isParameterEntity, value, base, systemId, publicId, notationName) => {
        //     console.log('entityDecl', entityName, isParameterEntity, value, base, systemId, publicId, notationName);
        // });
        //
        // parser.on('error', (error) => {
        //     console.error(error);
        // });
        //
        // parser.write(this.data);

        // console.log(this.root);

        return this;
    }
};

CrawlerMgr.singleton.regDataAnalysis(DATAANALYSIS.XML, function (crawler) {
    return new DA_XML(crawler);
});

exports.DA_XML = DA_XML;