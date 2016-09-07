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
    autoprefixer = require("autoprefixer");

var option = {base: 'src'};
var dist = __dirname + '/dist';

gulp.task('build:style', function (){
    gulp.src('src/style/style.scss', option)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions','> 1%']})]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('build:works:assets', function (){
    gulp.src('src/works/**/*.?(png|jpg|gif|js)', option)
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:works:style', function (){
    gulp.src('src/works/works.scss', option)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions','> 1%']})]))
        .pipe(nano())
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:works:html', function (){
    gulp.src('src/works/index.html', option)
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

gulp.task('build:works', ['build:works:assets', 'build:works:style', 'build:works:html']);

gulp.task('release', ['build:style', 'build:works']);

gulp.task('watch', ['release'], function () {
    gulp.watch('src/style/**/*', ['build:style']);
    gulp.watch('src/works/works.less', ['build:example:style']);
    gulp.watch('src/works/**/*.?(png|jpg|gif|js)', ['build:example:assets']);
    gulp.watch('src/**/*.html', ['build:works:html']);
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
        startPath: '/works'
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['release'], function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});