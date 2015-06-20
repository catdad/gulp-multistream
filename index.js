/* jshint node: true */

var through = require('through2');

module.exports = function MultiDest() {
    var destinations = Array.prototype.slice.call(arguments);
    var output = through.obj();
    
    function onData(data) {
        destinations.forEach(function(dest){
            dest.write(data);
        });
    }
    
    function onEnd() {
        destinations.forEach(function(dest){
            dest.end();
        });
    }
    
    output.on('data', onData);
    output.on('end', onEnd);
    
    return output;
};
