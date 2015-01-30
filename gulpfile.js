var browserify = require('gulp-browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

gulp.task('default', function() {
    var production = gutil.env.type === 'production';

    gulp.src(['app.js'], {read: false})

        // Browserify, and add source maps if this isn't a production build
        .pipe(browserify({
            debug: !production,
            transform: ['reactify'],
            extensions: ['.jsx']
        }))

        .on('prebundle', function(bundler) {
            // Make React available externally for dev tools
            bundler.require('react');
        })

        // Rename the destination file
        .pipe(rename('bundle.js'))

        // Output to the build directory
        .pipe(gulp.dest('build/'));
});