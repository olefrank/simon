var gulp           = require("gulp"),
    path           = require('path'),
    util           = require('gulp-util'),
    minifyHTML     = require("gulp-minify-html"),
    concat         = require("gulp-concat"),
    uglify         = require("gulp-uglify"),
    nano           = require("gulp-cssnano"),
    uncss          = require("gulp-uncss"),
    imagemin       = require("gulp-imagemin"),
    sourcemaps     = require("gulp-sourcemaps"),
    mainBowerFiles = require("main-bower-files"),
    inject         = require("gulp-inject"),
    less           = require("gulp-less"),
    filter         = require("gulp-filter"),
    glob           = require("glob"),
    browserSync    = require("browser-sync"),
    babel          = require('gulp-babel'),
    LessAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix     = new LessAutoPrefix({
        browsers: ['last 2 versions']
    }),
    KarmaServer    = require('karma').Server;

var config = {
    paths: {
        html: {
            src:  "src/**/*.html",
            dest: "build"
        },
        javascript: {
            src:  ["src/js/**/*.js"],
            dest: "build/js"
        },
        images: {
            src: ["src/images/**/*.jpg", "src/images/**/*.jpeg", "src/images/**/*.png"],
            dest: "build/images"
        },
        audio: {
            src: ["src/audio/**/*.mp3"],
            dest: "build/audio"
        },
        less: {
            src: ["src/less/**/*.less", "!src/less/includes/**"],
            dest: "build/css"
        },
        bower: {
            src: "bower_components",
            dest: "build/lib"
        }
    }
};

gulp.task("html", function(){
    return gulp.src(config.paths.html.src)
        .pipe(inject(
            gulp.src(
                mainBowerFiles(),
                {read: false, cwd: "bower_components"}
            ),
            {name: "bower", addPrefix: "lib"}
        ))
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task('babel', function() {
    gulp.src(config.paths.javascript.src)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.javascript.dest));
});

gulp.task("images", function(){
    return gulp.src(config.paths.images.src)
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.paths.images.dest));
});

gulp.task("less", function(){
    return gulp.src(config.paths.less.src)
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }).on('error', util.log))
        .pipe(concat('app.min.css'))
        .pipe(nano())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(config.paths.less.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task("audio", function() {
    return gulp.src(config.paths.audio.src)
        .pipe(gulp.dest(config.paths.audio.dest));
});

gulp.task("bower", function(){
    return gulp.src(mainBowerFiles(), {base: "bower_components"})
        .pipe(gulp.dest(config.paths.bower.dest));
});

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('tdd', function (done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js')
    }, done()).on('error', function(err) {
        throw err;
    }).start();
});

gulp.task('test', function (done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true,
        autoWatch: false
    }, done()).on('error', function(err) {
        throw err;
    }).start();
});

gulp.task("tasks", ["bower", "html", "babel", "less", "images", "audio"]);

gulp.task("build", ["test", "tasks"]);

gulp.task("dev", ["tasks", "tdd"]);

gulp.task("default", ["dev", "browser-sync"], function(){
    gulp.watch(config.paths.html.src, ["html", browserSync.reload]);
    gulp.watch(config.paths.es6.src, ["babel", browserSync.reload]);
    gulp.watch(config.paths.bower.src, ["bower", browserSync.reload]);
    gulp.watch(config.paths.images.src, ["images", browserSync.reload]);
    gulp.watch(config.paths.audio.src, ["audio", browserSync.reload]);
    gulp.watch(config.paths.less.src, ["less"]);
});
