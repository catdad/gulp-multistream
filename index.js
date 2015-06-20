/* jshint node: true */

var through = require('through2');

module.exports = function MultiDest() {
    // get all streams from the args in an array
    var destinations = Array.prototype.slice.call(arguments);
    // get an output stream
    var output = through.obj();
    
    function onData(data) {
        // copy any data to all streams
        destinations.forEach(function(dest){
            dest.write(data);
        });
    }
    
    function onEnd() {
        // end all streams
        destinations.forEach(function(dest){
            dest.end();
        });
    }
    
    output.on('data', onData);
    output.on('end', onEnd);
    
    return output;
};
