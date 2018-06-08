'use strict';
// generated on 2015-04-04 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();
const babel = require('gulp-babel');


gulp.task('scripts', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["array-includes", "transform-object-rest-spread"]
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('compile-to-es5', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["array-includes", "transform-object-rest-spread"]
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});


var rename = require('gulp-rename');

gulp.task('js', ['scripts', 'compile-to-es5'], function () {
    var jsFilter = $.filter('**/*.js', {restore: true});

    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["array-includes", "transform-object-rest-spread"]
        }))
        .pipe($.uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['js', 'copy-js', 'main-bower-files'], function(){
        return gulp.src('./bower_components/isotope/dist/isotope.pkgd.js')
        .pipe(gulp.dest('./examples/libs/isotope'))
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex  = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic('.tmp'))
        .use(serveStatic('examples'))
        .use(serveIndex('examples'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

var mainBowerFiles = require('gulp-main-bower-files');

gulp.task('main-bower-files', function() {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            includeDev:true, 
            overrides: {
                "isotope-packery": {
                    main: "packery-mode.pkgd.js"
                },
                vue: {
                    main: './dist/vue.js'
                }
            }
        }))
        .pipe(gulp.dest('./examples/libs'));
});

gulp.task('copy-js', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["array-includes", "transform-object-rest-spread"]
        }))
        .pipe(gulp.dest('./examples/src'));
});

var jip = require('jasmine-istanbul-phantom');
var changedSpec = null

gulp.task('test', function(done) {
  var options = { callback: done, lib : ['bower_components/**/*.js'] }

  if (changedSpec)
    options.spec = changedSpec

  jip(options)

  changedSpec = null
});
 
gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload;
 
   server.listen();
    // watch for changes
 
   gulp.watch([
        'examples/*.html',
        'src/**/*.js',
        'examples/*.css',
        'examples/**/*.js',
    ]).on('change', server.changed);


    gulp.watch('./bower.json').on('change', function() {
        gulp.start('main-bower-files')
    });
 
    gulp.watch('src/**/*.js', ['scripts']);

    gulp.watch('src/**/*.js').on('change', function() {
        gulp.start('copy-js');
        gulp.start('test');
    });

    // gulp.watch('test/spec/*.js').on('change', function(event){
    //     changedSpec = event.path
    //     gulp.start('test')
    // });
});
