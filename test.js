/* jshint node: true */

var multistream = require('./index.js');

var es = require('event-stream');
var File = require('vinyl');

var fakeData = 'llama';

function testStream(file, outputname) {
    console.log(outputname, ': isStream:', file.isStream());
    
    file.contents.pipe(es.wait(function(err, data) {
        console.log(outputname, ': data:', data === fakeData);
    }));
}

function testBuffer(file, outputname) {
    console.log(outputname, ': isBuffer:', file.isBuffer());
    
    var data = file.contents.toString('utf8');
    console.log(outputname, ': data:', data === fakeData);
}

function test(input, out1, out2, testFunc) {
    var multi = multistream(out1, out2);

    out1.on('data', function(file) {
        testFunc(file, 'out1');
    }).on('end', function() {
        console.log('out1 :', 'end');
    });

    out2.on('data', function(file) {
        testFunc(file, 'out2');
    }).on('end', function() {
        console.log('out2 :', 'end');
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
