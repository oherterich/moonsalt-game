// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var watchify = require('watchify');

// Server
var express = require('express');
var app = express();
var server = require('http').Server(app);

// my files
var SocketCtrl = require('./controllers/socket.js');
var socket = new SocketCtrl(server);

// tasks
gulp.task('lint', function () {
	gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('clean', function () {
	gulp.src('./dist/*')
		.pipe(clean({force: true}));
	gulp.src('./app/js/bundled.js')
		.pipe(clean({force: true}));
});

gulp.task('minify-css', function () {
	var opts = {comments:true, spare:true};
	gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
		.pipe(minifyCSS(opts))
		.pipe(gulp.dest('dist/'));
});

gulp.task('minify-js', function () {
	gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
		.pipe(uglify({
			// inSourceMap: 
			// outSourceMap: "app.js.map"
		}))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('copy-bower-components', function () {
	gulp.src('./app/bower_components/**')
		.pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
	gulp.src('./app/**/*.html')
		.pipe(gulp.dest('dist/'));
});

gulp.task('browserify', function () {
	gulp.src('./app/js/*.js')
		.pipe(browserify({
			insertGlobals: true,
			debug: true
		}))
		.pipe(concat('bundled.js'))
		.pipe(gulp.dest('./app/js'))
});

gulp.task('connect', function () {
	server.listen(8080);

	app.use (express.static("./app"));

	// io.on('connection', function (socket) {
	//   socket.emit('news', { hello: 'world' });
	//   socket.on('my other event', function (data) {
	//     console.log(data);
	//   });
	// });
});

gulp.task('connectDist', function () {
	connect.server({
		root: 'dist/',
		port: 9999
	});
});

gulp.task('browserifyDist', function () {
	gulp.src(['app/js/main.js'])
		.pipe(browserify({
			insertGlobals: true,
			debug: true
		}))
		.pipe(concat('bundled.js'))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('socket', function() {
    socket.init();
});

gulp.task('default',
	['lint', 'browserify', 'connect', 'socket']
);

gulp.task('build',
	['lint', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components', 'connectDist', 'browserifyDist']
);