var gulp            = require('gulp');
var $               = require('gulp-load-plugins')();
var autoprefixer    = require('autoprefixer');
var runSequence     = require('run-sequence');
var cssnano         = require('cssnano');
var del             = require('del');
var browserSync     = require('browser-sync').create();
var ghPages         = require('gulp-gh-pages');

// clean dist dir
gulp.task('clean', function () {
    return del(['dist', 'src/css']);
});

// process stylesheets
gulp.task('styles', function () {
    var postCssProcessors = [
        autoprefixer({ browsers: ['last 2 versions'] })
    ];

    gulp.src('src/scss/**/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.postcss(postCssProcessors))
        .pipe(gulp.dest('src/css'));
});

// process scripts
gulp.task('scripts', function () {
    // ordered array of javascript source files
    var sourceJS = [
        'src/js/background.js',
        'src/js/greeting.js',
        'src/js/quote.js',
        'src/js/app.js' // must come last!
    ];

    gulp.src(sourceJS)
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build', function (done) {
    runSequence(
        'clean',
        'styles',
        'min',
        done);
});

gulp.task('min', function () {
    var indexHtmlFilter = $.filter(['src/index.html'], { restore: true });
    var jsFilter = $.filter(['src/js/**/*.js'], { restore: true });
    var cssFilter = $.filter('src/css/**/*.css', { restore: true });
    var allWithoutIndexHtmlFilter = $.filter(['**/*', '!src/index.html'], { restore: true });

    var postCssProcessors = [
        cssnano({ zindex: false })
    ];

    var mainStream = gulp.src('src/index.html')
        // Now start with the "real" minification
        .pipe($.useref())

        // JS
        .pipe(jsFilter)
        // Strip console, alert, and debugger statements from JavaScript code
        .pipe($.stripDebug())
        // uglify JS code
        .pipe($.uglify(
            {
                preserveComments: $.uglifySaveLicense
            }))
        .pipe(jsFilter.restore)

        // CSS
        .pipe(cssFilter)
        .pipe($.postcss(postCssProcessors))
        .pipe(cssFilter.restore)

        .pipe(allWithoutIndexHtmlFilter)
        .pipe($.rev())                // Rename the concatenated files (but not index.html)
        .pipe(allWithoutIndexHtmlFilter.restore)
        .pipe($.revReplace())         // Substitute in new filenames

        // HTML
        .pipe(indexHtmlFilter)

        // minify html, for options see https://github.com/kangax/html-minifier
        .pipe($.htmlmin({
             collapseWhitespace: true,
             removeComments: true
        }))
        .pipe(indexHtmlFilter.restore)

        .pipe(gulp.dest('dist'));

    return mainStream;
});

// default task contains our watcher
gulp.task('watch', ['styles'], function() {
    // watch sass source files and convert on changes
    gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('serve', function (done) {
    runSequence(
        'clean',
        'watch',
        'browser-sync',
        'livereload',
        done);
});

gulp.task('browser-sync', function () {

    var baseDir = [
        'src'
    ];

    browserSyncInit(baseDir);
});

gulp.task('livereload', function () {
    gulp.watch(['src/**/*.*'])
        .on('change', browserSync.reload);
});

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});




/////////////////////
// server functions //
/////////////////////

function browserSyncInit(baseDir, files, browser) {
    var browserToUse = browser === undefined
        ? 'default'
        : browser;

    var syncOptions = {
        startPath: '/',
        server: {
            baseDir: baseDir
        },
        browser: browserToUse,
        logLevel: 'debug',
        reloadDelay: 100,
        reloadDebounce: 0,
        logPrefix: 'Browsersync'
    };

    browserSync.init(syncOptions);
}
