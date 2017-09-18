/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var es = require('event-stream');
var File = require('vinyl');
var async = require('async');

var multistream = require('../');

describe('[index]', function () {
    var fakeData = 'llama';

    it('works with stream data', function (done) {
        var out1 = es.through();
        var out2 = es.through();

        var inputFile = new File({
            contents: es.readArray([fakeData])
        });

        var multi = multistream(out1, out2);

        async.parallel([
            function (next) { out1.on('end', next); },
            function (next) { out2.on('end', next); },
            function (next) { multi.on('end', next); }
        ], done);

        multi.write(inputFile);
        multi.end();
    });

    it('works with buffer data');

    it('waits for all destination streams to finish before ending');
});
