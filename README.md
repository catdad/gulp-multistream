# gulp-multistream

### Install:

    npm install -D gulp-multistream
    
### Use:

    var multistream = require('gulp-multistream');
    
    gulp.task('doStuff', function() {
        return gulp.src('myfile.js')
            .pipe(doTheStuff())
            .pipe(multistream( gulp.dest('dest1'), gulp.dest('dest2') ); 
    });
    
And just in case you missed the significance, here's another example:

    var multistream = require('gulp-multistream');
    
    var destinations = [];
    
    if (useDest1) { destinations.push( gulp.dest('dest1'); }
    if (useDest2) { destinations.push( gulp.dest('dest2'); }
    if (useDest3) { destinations.push( gulp.dest('dest3'); }
    
    gulp.task('doStuff', function() {
        return gulp.src('myfile.js')
            .pipe(doTheStuff())
            .pipe(multistream.apply(undefined, destinations)); 
    });
    
### But why:

Well, I had a build that needed to build some modules, concat, and output to 15 different folders. Except, when it needed to output to 10 folders. Or when it needed to output to 8 folders. I think you get the idea. And then I wrote 12 more such tasks, that copy to 15, 10, or 8 folders... sometimes. And, well, I refuse to maintain hardcoded destinations for that. `gulp-multistream` to the rescue.

If you find a great use for this that is not fully supported by the exact 20 lines of this plugin, please feel free to submit [submit an issue](https://github.com/catdad/gulp-multistream/issues).

[![Analytics](https://ga-beacon.appspot.com/UA-17159207-7/gulp-multistream/readme)](https://github.com/igrigorik/ga-beacon)
