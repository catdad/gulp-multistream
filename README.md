# gulp-multistream

[![travis][travis.svg]][travis.link]
[![cov-codeclimate][cov-codeclimate.svg]][cov-codeclimate.link]
[![score-codeclimate][score-codeclimate.svg]][score-codeclimate.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]
[![dm-david][dm-david.svg]][dm-david.link]
[![ISC License][10]][11]
[![Analytics][12]][13]

[travis.svg]: https://travis-ci.org/catdad/gulp-multistream.svg?branch=master
[travis.link]: https://travis-ci.org/catdad/gulp-multistream
[cov-codeclimate.svg]: https://codeclimate.com/github/catdad/gulp-multistream/badges/coverage.svg
[cov-codeclimate.link]: https://codeclimate.com/github/catdad/gulp-multistream/coverage
[score-codeclimate.svg]: https://codeclimate.com/github/catdad/gulp-multistream/badges/gpa.svg
[score-codeclimate.link]: https://codeclimate.com/github/catdad/gulp-multistream
[npm-downloads.svg]: https://img.shields.io/npm/dm/gulp-multistream.svg
[npm.link]: https://www.npmjs.com/package/gulp-multistream
[npm-version.svg]: https://img.shields.io/npm/v/gulp-multistream.svg
[dm-david.svg]: https://david-dm.org/catdad/gulp-multistream.svg
[dm-david.link]: https://david-dm.org/catdad/gulp-multistream

[10]: https://img.shields.io/npm/l/gulp-multistream.svg
[11]: http://opensource.org/licenses/ISC

[12]: https://ga-beacon.appspot.com/UA-17159207-7/gulp-multistream/readme?flat
[13]: https://github.com/igrigorik/ga-beacon


### Install:

    npm install -D gulp-multistream

### Use:

```javascript
var multistream = require('gulp-multistream');

gulp.task('doStuff', function() {
  return gulp.src('myfile.js')
    .pipe(doTheStuff())
    .pipe(multistream( gulp.dest('dest1'), gulp.dest('dest2') );
});
```

And just in case you missed the significance, here's another example:

```javascript
var multistream = require('gulp-multistream');

gulp.task('doStuff', function() {
  var destinations = [];

  if (useDest1) { destinations.push( gulp.dest('dest1') ); }
  if (useDest2) { destinations.push( gulp.dest('dest2') ); }
  if (useDest3) { destinations.push( gulp.dest('dest3') ); }

  // Do we have 1, 2, or 3 destinations?
  // Why should I have to care at this point?

  return gulp.src('myfile.js')
    .pipe(doTheStuff())
    .pipe(multistream.apply(undefined, destinations));
});
```

### But why:

Well, I had a build that needed to build some modules, concat, and output to 15 different folders. Except, when it needed to output to 10 folders. Or when it needed to output to 8 folders. I think you get the idea. And then I wrote 12 more such tasks, that copy to 15, 10, or 8 folders... sometimes. And, well, I refuse to maintain hardcoded destinations for that. `gulp-multistream` to the rescue.

If you find a great use for this that is not fully supported by the exact 20 lines of this plugin, please feel free to [submit an issue](https://github.com/catdad/gulp-multistream/issues).
