var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    useref = require('gulp-useref'),
    browserSync = require('browser-sync').create(),
    gulpif = require('gulp-if'),
    rename = require("gulp-rename"),
    uglifycss = require('gulp-uglifycss'),
    nunjucksRender = require('gulp-nunjucks-render');



//browserSync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});



//sctipt.js uglify
/*gulp.task('scripts', function() {
  gulp.src('app/js/scripts.js')
  	.pipe(plumber())
    .pipe(uglify())
  	.pipe(rename({
     extname: '.min.js'
   	}))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
	
});*/



//sass
gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
                browsers: ['> 1%', 'last 2 versions'],
                cascade: false
            }))
    .pipe(gulp.dest('www/css'))
    .pipe(browserSync.stream());
});


//nunjucks template
gulp.task('nunjucks', function () {
  return gulp.src('pages/**/*.html')
    .pipe(nunjucksRender({
      path: ['./templates/'] // String or Array
    }))
    .pipe(gulp.dest('www'));
});


//watch task
gulp.task('watch', function(){
    browserSync.init({
        server: {
            baseDir: "www"
        }
    });

	//gulp.watch(['pages/**/*.html', 'templates/**/*.html' ], ['nunjucks']);
	gulp.watch('sass/*.scss',['sass']);
  gulp.watch("www/*.html").on("change", browserSync.reload);
  gulp.watch('www/js/*.js').on("change", browserSync.reload);
});



gulp.task('default', ['watch', 'nunjucks']);




// jshint
gulp.task('jshint', function(){
    gulp.src('www/js/scripts.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish')); // other argument 'default' 
})


//images compress
gulp.task('image', function(){
	return gulp.src('img/*')
		.pipe(imagemin())
        .pipe(gulp.dest('img/built'));
});


//build
gulp.task('build', function () {
    return gulp.src('www/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', uglifycss()))
        .pipe(gulp.dest('dist'));
});