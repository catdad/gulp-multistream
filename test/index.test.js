/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var es = require('event-stream');
var through = require('through2');
var File = require('vinyl');
var async = require('async');
var eos = require('end-of-stream');

var multistream = require('../');

describe('[index]', function () {
  var fakeData = 'llama';

  function noop() {}

  function slowStream(time) {
    return through.obj(function (obj, enc, cb) {
      setTimeout(function () {
        cb(null, obj);
      }, time || 1);
    });
  }

  function wait(stream) {
    return function (next) {
      stream.on('data', noop);
      eos(stream, next);
    };
  }

  function doMultiWrite(input, out1, out2) {
    var multi = multistream(out1, out2);

    setImmediate(function () {
      multi.write(input);
      multi.end();
    });

    return multi;
  }

  function test(input, out1, out2, done) {
    var multi = doMultiWrite(input, out1, out2);
    var data = [];

    async.parallel([
      wait(out1),
      wait(out2),
      wait(multi)
    ], function (err) {
      done(err, data);
    });

    multi.on('data', function (chunk) {
      data.push(chunk);
    });

    return multi;
  }

  it('works with stream data', function (done) {
    var out1 = es.through();
    var out2 = es.through();

    var inputFile = new File({
      contents: es.readArray([fakeData])
    });

    test(inputFile, out1, out2, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.have.lengthOf(1);

      var file = data[0];

      expect(file).to.equal(inputFile);
      expect(file.isBuffer()).to.equal(false);
      expect(file.isStream()).to.equal(true);

      done();
    });
  });

  it('works with buffer data', function (done) {
    var out1 = es.through();
    var out2 = es.through();

    var inputFile = new File({
      contents: new Buffer(fakeData)
    });

    test(inputFile, out1, out2, function (err, data) {
      if (err) {
        return done(err);
      }

      expect(data).to.have.lengthOf(1);

      var file = data[0];

      expect(file).to.equal(inputFile);
      expect(file.isBuffer()).to.equal(true);
      expect(file.isStream()).to.equal(false);

      done();
    });
  });

  it('waits for all destination streams to finish before ending', function (done) {
    var order = [];
    var out1 = slowStream(1);
    var out2 = slowStream(2);

    function waitOrder(name, stream) {
      return function (next) {
        wait(stream)(function (err) {
          order.push(name);
          next(err);
        });
      };
    }

    var inputFile = new File({
      contents: new Buffer(fakeData)
    });
    var multi = doMultiWrite(inputFile, out1, out2);

    async.parallel([
      waitOrder('out1', out1),
      waitOrder('out2', out2),
      waitOrder('multi', multi)
    ], function (err) {
      expect(order).to.deep.equal(['out1', 'out2', 'multi']);
      done(err);
    });
  });

  it('passes through all files', function (done) {
    var multidata = [];
    var out1 = slowStream(1);
    var out2 = slowStream(2);

    var inputFile = new File({
      contents: new Buffer(fakeData)
    });
    var multi = doMultiWrite(inputFile, out1, out2);

    async.parallel([
      wait(out1),
      wait(out2),
      function (next) {
        multi.on('data', function (chunk) {
          multidata.push(chunk);
        });

        eos(multi, next);
      }
    ], function (err) {
      if (err) {
        return done(err);
      }

      expect(multidata).to.have.lengthOf(1);
      expect(multidata).to.deep.equal([inputFile]);

      done();
    });
  });
});
