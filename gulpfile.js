var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var webpack = require('gulp-webpack');
var replace = require('gulp-replace');

var version = require('./package.json').version;

var dest = 'build';
var path = {
	js: 'src/**/*.js'
};

var webpackConf = {
	entry: './src/bscroll/bscroll',
	output: {
		path: __dirname + '/' + dest,
		filename: "bscroll.js",
		libraryTarget: 'umd'
	}
};

gulp.task('clean', require('del').bind(null, [dest]));


gulp.task('script', function () {

	return gulp.src(path.js)
		.pipe(webpack(webpackConf))
		.pipe(replace(/__VERSION__/g, '\'' + version + '\''))
		.pipe(gulp.dest(dest));
});

gulp.task('connect', ['compile'], function () {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.']
		},
		startPath: 'demo/index.html'
	});

	// watch for changes
	gulp.watch(path.js, function () {
		gulp.start('script');
		reload();
	});
});

gulp.task('compile', ['script']);

gulp.task('default', ['clean'], function () {

	gulp.start('compile');
});

gulp.task('serve', ['clean'], function () {
	gulp.start('connect');
});