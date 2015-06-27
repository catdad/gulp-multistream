/* jshint node: true */

var multistream = require('./index.js');

var es = require('event-stream');
var File = require('vinyl');
var assert = require('assert');

var fakeData = 'llama';

function testStream(file) {
    assert(file.isStream(), 'should be a stream');

    file.contents.pipe(es.wait(function(err, data) {
        assert.strictEqual(data, fakeData, data + ' should have been ' + fakeData);
    }));
}

function testBuffer(file) {
    assert(file.isBuffer(), 'something here');
    
    var data = file.contents.toString('utf8');
    assert.strictEqual(data, fakeData, data + ' should have been ' + fakeData);
}

function test(input, out1, out2, testFunc) {
    var multi = multistream(out1, out2);

    out1.on('data', function(file) {
        testFunc(file);
    }).on('end', function() {
        console.log('end');
    });

    out2.on('data', function(file) {
        testFunc(file);
    }).on('end', function() {
        console.log('end');
    });

    multi.write(input);
    multi.end();
}

// test using inputs
var inputStream = new File({
    contents: es.readArray([fakeData])
});

var out1 = es.through();
var out2 = es.through();

test(inputStream, out1, out2, testStream);

// test using buffers
var inputBuffer = new File({ contents: new Buffer(fakeData) });

var out3 = es.through();
var out4 = es.through();

test(inputBuffer, out3, out4, testBuffer);
