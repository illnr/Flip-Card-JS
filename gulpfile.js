let gulp = require("gulp");
let sourcemaps = require("gulp-sourcemaps");
let uglify = require('gulp-uglify-es').default;
let rollup = require('gulp-better-rollup');
let babel = require('rollup-plugin-babel');
let rename = require("gulp-rename");
let pump = require('pump');

// .babelrc
// https://sebastiandedeyne.com/posts/2017/whats-in-our-babelrc

// es6module
function es6m(cb) {
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
};
exports.es6m = es6m;
// es6module minified
function es6m_min(cb) {
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
};
exports.es6m_min = es6m_min;

function old(cb) {
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
};
exports.old = old;

function old_min(cb) {
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
};
exports.old_min = old_min;

// Normal (without module, but including class etc
function normal(cb) {
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
};
exports.normal = normal;

// Normal minified (without module, but including class etc
function normal_min(cb) {
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
};
exports.normal_min = normal_min;

exports.default = gulp.parallel(es6m, es6m_min, normal, normal_min, old, old_min);
