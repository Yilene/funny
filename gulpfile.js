var yargs = require("yargs").argv,
    path = require("path"),
    fs = require("fs"),
    browserSync = require("browser-sync"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    nano = require("gulp-cssnano"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    tap = require("gulp-tap"),
    autoprefixer = require("autoprefixer"),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    webpackConfig = require("./webpack.config");

var option = {base: 'src'};
var dist = __dirname + '/dist';

gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    webpack(
        myConfig
        , function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
            callback();
        });
});

gulp.task('style', function (){
    gulp.src('dist/style.css', option)
        .pipe(nano())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', function (){
    gulp.src('src/assets/**/*.?(png|jpg|gif|js)', option)
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function (){
    gulp.src('src/index.html', option)
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();
            contents = contents.replace(/<link\s+rel="import"\s+href="(.*)">/gi, function (match, $1){
                var filename = path.join(dir, $1);
                var id = path.basename(filename, '.html');
                var content = fs.readFileSync(filename, 'utf-8');
                return '<script type="text/html" id="tpl_'+ id +'">\n'+ content +'\n</script>';
            });
            file.contents = new Buffer(contents);
        }))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', ['html', 'assets', 'webpack', 'style']);

gulp.task('watch', ['build'], function () {
    gulp.watch('src/works/**/*.scss', ['webpack', 'style']);
    gulp.watch('src/assets/**/*.?(png|jpg|gif|js)', ['assets','webpack']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/entry.js', ['webpack','style'])
});

gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: ''
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['build'], function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});