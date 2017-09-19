/* jshint node: true */

var through = require('through2');
var eos = require('end-of-stream');

module.exports = function MultiDest() {
  // get all streams from the args in an array
  var destinations = Array.prototype.slice.call(arguments);

  // get an output stream
  var output = through.obj(function onData(file, enc, cb) {
    // copy any data to all streams
    destinations.forEach(function (dest) {
      dest.write(file);
    });

    cb(null, file);
  }, function onFlush(cb) {
    var finishedCount = 0;

    function onFinish() {
      finishedCount += 1;

      if (finishedCount === destinations.length) {
        cb();
      }
    }

    // end all streams
    destinations.forEach(function (dest) {
      eos(dest, onFinish);
      dest.end();
    });
  });

  return output;
};
