'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'), 
    rigger = require('gulp-rigger'),
    browserSync = require("browser-sync"),
    notify = require("gulp-notify"),
    sass = require('gulp-ruby-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    imageminPngquant = require('imagemin-pngquant'),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'website/',
        img: 'website/img/',
        styles: 'website/css/'  
    },
    src: {
        html: 'src/*.html',
        img: 'src/img/**/*.*',
        styles: 'src/slytes/main.scss' 
    },
    watch: {
        html: 'src/**/*.html',
        img: 'src/img/**/*.*',
        styles: 'src/styles/**/*.scss'
    },
    clean: './website'
};

var config = {
    server: {
        baseDir: "./website"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "iqhub-webstudio"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('styles:build', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('website/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('website/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)       
        .pipe(imageminPngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'styles:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });  
    watch([path.watch.styles], function(event, cb) {
        gulp.start('styles:build');
    }); 
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);