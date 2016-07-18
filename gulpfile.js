var gulp = require("gulp");
var browserify = require('browserify');
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var watchify = require("gulp-watchify");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");


var paths = {
	OUT: "bundle.js",
	SRC: "./src/js/",
	BUILD: "./public/js/"
};

gulp.task("server", function() {
	browser({
    port: 8888,
		server: {
			baseDir: "./"
		}
	});
});

gulp.task("sass", function() {
	gulp.src("./src/scss/*scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest("./public/css"))
		.pipe(browser.reload({stream: true}))
});

gulp.task("js", function() {
	watchify(browserify(paths.SRC + 'main.js', { debug: true})
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.pipe(source(paths.OUT))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.BUILD))
		.pipe(browser.reload({stream: true}))
)});

gulp.task("content", function () {
	browser.reload()
});

gulp.task("default", ['server', 'js', 'sass'], function() {
    gulp.watch('./src/js/*js', ["js"]);
    gulp.watch('./src/scss/*scss', ["sass"]);
	gulp.watch(['./index.html', './content/*html'], ["content"]);
});
