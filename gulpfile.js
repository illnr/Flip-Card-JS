var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require('gulp-uglify');
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');
var rename = require("gulp-rename");
var pump = require('pump');

// .babelrc
// https://sebastiandedeyne.com/posts/2017/whats-in-our-babelrc

gulp.task("es6module", function () {
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
                format: 'es',
            }
        ))
        // .pipe(uglify())
        .pipe(rename({
            // dirname: "main/text/ciao",
            basename: "flipcard",
            // prefix: "bonjour-",
            suffix: "-es6module",
            extname: ".js"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("oldBrowsers", function () {
    return gulp.src("src/flipcard.js")
        .pipe(sourcemaps.init())
        .pipe(rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ))
        .pipe(rename({
            basename: "flipcard",
            suffix: "-oldBrowserSupport",
            extname: ".js"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("oldBrowsersMin", function () {
    return gulp.src("src/flipcard.js")
        .pipe(sourcemaps.init())
        .pipe(rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ))
        .pipe(uglify())
        .pipe(rename({
            basename: "flipcard",
            suffix: "-oldBrowserSupport",
            extname: ".min.js"
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

// Normal (without module, but including class etc
gulp.task("normal", function () {
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
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

// gulp.task('default', ['es6module', 'normal']);