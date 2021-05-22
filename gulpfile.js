// gulpfile.js
var gulp                = require("gulp"),
    del                 = require("del"),
    gulpUsemin          = require("gulp-usemin"),
    gulpCssmin          = require('gulp-cssmin'),
    gulpCsslint         = require('gulp-csslint'),
    gulpUnglify         = require('gulp-uglify'),
    gulpJshint          = require('gulp-jshint'),
    jshintStylish       = require('jshint-stylish'),
    gulpImagemin        = require('gulp-imagemin'),
    gulpAutoprefixer    = require('gulp-autoprefixer'),
    browserSync         = require('browser-sync')
;

let path = {
    src     : 'src/**/*',
    dest    : 'dist/',
    images : {
        src     : 'src/img/**/*.{jpg,jpeg,png}',
        dest    : 'dist/img/'
    },
    styles : {
        src : "src/css/**/*.css",
        dest : "dist/css/"
    },
    scripts : {
        src : "src/js/**/*.js",
        dest : "dist/js/"
    }
}

function clean() {
    return del([path.dest]);
}

function copy() {
    return gulp.src(path.images.src)
                .pipe(gulp.dest(path.images.dest));
}

function usemin() {
    return gulp.src(path.src + '.html')
                .pipe(gulpUsemin({
                    css: [gulpCsslint, gulpCssmin, gulpAutoprefixer],
                    js: [gulpUnglify, gulpJshint]
                }))
                .pipe(gulpCsslint.formatter())
                .pipe(gulpJshint.reporter(jshintStylish))
                .pipe(gulp.dest(path.dest))
                ;
}

function reduceImages() {
    return gulp.src(path.images.src)
                .pipe(gulpImagemin())
                .pipe(gulp.dest(path.images.dest));
}

let build = gulp.series(clean, copy, usemin, gulp.parallel(reduceImages));
exports.default = build;

function server() {
    browserSync.init({
        server : {
            baseDir: "src"
        }
    });

    gulp.watch(path.src).on('change', browserSync.reload);

    gulp.watch(path.scripts.src).on('change', function(path) {
        console.log('Linting ' + path);

        gulp.src(path)
            .pipe(gulpJshint())
            .pipe(gulpJshint.reporter(jshintStylish));
    });

    gulp.watch(path.styles.src).on('change', function(path) {
        console.log('Linting ' + path);

        gulp.src(path)
            .pipe(gulpCsslint())
            .pipe(gulpCsslint.formatter());
    });
}

exports.server = server;