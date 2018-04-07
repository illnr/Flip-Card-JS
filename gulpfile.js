let gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
let uglify = require('gulp-uglify-es').default;
var rollup = require('gulp-better-rollup');
var babel = require('rollup-plugin-babel');
let rename = require("gulp-rename");
var pump = require('pump');
var runSequence = require('run-sequence');

// .babelrc
// https://sebastiandedeyne.com/posts/2017/whats-in-our-babelrc

// es6module
gulp.task("es6m", function (cb) {
    pump([
        gulp.src("src/flipcard.js"),
        sourcemaps.init(),
        rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                // plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'es',
            }
        ),
        // uglify(),
        rename({
            basename: "flipcard",
            suffix: "-es6m",
            extname: ".js"
        }),
        sourcemaps.write("."),
        gulp.dest("dist")
    ],
    cb);
});
// es6module minified
gulp.task("es6m.min", function (cb) {
    pump([
            gulp.src("src/flipcard.js"),
            sourcemaps.init(),
            rollup(
                {
                    // notice there is no `input` option as rollup integrates into gulp pipeline
                    // plugins: [babel()]
                },
                {
                    // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                    name: 'FlipCard',
                    format: 'es',
                }
            ),
            uglify(),
            rename({
                basename: "flipcard",
                suffix: "-es6m",
                extname: ".min.js"
            }),
            sourcemaps.write("."),
            gulp.dest("dist")
        ],
        cb);
});

gulp.task("old", function (cb) {
    pump([
        gulp.src("src/flipcard.js"),
        sourcemaps.init(),
        rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ),
        rename({
            basename: "flipcard",
            suffix: "-oldBrowserSupport",
            extname: ".js"
        }),
        sourcemaps.write("."),
        gulp.dest("dist")
    ],
    cb);
});

gulp.task("old.min", function (cb) {
    pump([
        gulp.src("src/flipcard.js"),
        sourcemaps.init(),
        rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ),
        uglify(),
        rename({
            basename: "flipcard",
            suffix: "-oldBrowserSupport",
            extname: ".min.js"
        }),
        sourcemaps.write("."),
        gulp.dest("dist")
    ],
    cb);
});

// Normal (without module, but including class etc
gulp.task("normal", function (cb) {
    pump([
        gulp.src("src/flipcard.js"),
        sourcemaps.init(),
        rollup(
            {
                // notice there is no `input` option as rollup integrates into gulp pipeline
                // plugins: [babel()]
            },
            {
                // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                name: 'FlipCard',
                format: 'iife',
            }
        ),
        sourcemaps.write("."),
        gulp.dest("dist")
    ],
    cb);
});

// Normal minified (without module, but including class etc
gulp.task("normal.min", function (cb) {
    pump([
            gulp.src("src/flipcard.js"),
            sourcemaps.init(),
            rollup(
                {
                    // notice there is no `input` option as rollup integrates into gulp pipeline
                    // plugins: [babel()]
                },
                {
                    // also rollups `sourcemap` option is replaced by gulp-sourcemaps plugin
                    name: 'FlipCard',
                    format: 'iife',
                }
            ),
            uglify(),
            rename({suffix:'.min'}),
            sourcemaps.write("."),
            gulp.dest("dist")
        ],
        cb);
});

gulp.task('default',  function(callback) {
    runSequence(
        'normal',
        'normal.min',
        'es6m',
        'es6m.min',
        'old',
        'old.min',
        callback);
});