var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require('gulp-uglify');
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');

gulp.task("default", function () {
    return gulp.src("src/flipcard.js")
        .pipe(sourcemaps.init())
        .pipe(rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                // plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ))
        // .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});