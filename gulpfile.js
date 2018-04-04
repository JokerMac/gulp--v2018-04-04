/**
 * Created by mayn on 2018/3/13.
 */
var gulp = require('gulp'),                    // 引入Gulp
    minifycss = require('gulp-clean-css'),    // css压缩
    uglify = require('gulp-uglify'),        // js压缩
    concat = require('gulp-concat'),        // 文件合并
    rename = require('gulp-rename'),        // 文件更名
    less = require('gulp-less'),            // less2css
    cssver = require('gulp-make-css-url-version-extend'),//给css文件里引用文件加版本号（文件MD5）
    copy = require('gulp-copy'),//复制文件
    autoprefixer = require('gulp-autoprefixer'),//自动添加浏览器私有前缀
    watch = require('gulp-watch');//监听

//创建一个监听，用于监听源文件变化之后，及时通知其进行再次编译，并实时通知浏览器端视图刷新，做到自动刷新功能
// gulp.task('watch', function () {
//     gulp.watch('src/less/**/*.less', ['watch2less2css']);
// });
//
// gulp.task('watch2less2css', function () {
//     return gulp.src(['src/less/component*/*.less','src/less/view*/*.less'])
//         .pipe(less())
//         .pipe(gulp.dest('src/css'));
// });

gulp.task('less2css', function () {
    return gulp.src(['src/less/**/*.less', '!src/less/base/**'])
        .pipe(less())
        .pipe(gulp.dest('src/css'));
});

gulp.task('autoprefixer', ['less2css'], function () {
    gulp.src('src/css/**')
        .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'));
});

gulp.task('cssver', ['autoprefixer'], function () {
    return gulp.src('src/css/**/*.css')
        .pipe(cssver({useDate: true}))
        .pipe(gulp.dest('src/css'));
});

gulp.task('copy', ['cssver'], function () {
    return gulp.src(['src/css*/**', 'src/template*/**', 'src/images*/**'])
        .pipe(gulp.dest('dev'));
});

gulp.task('copy-backend', ['copy'], function () {
    return gulp.src(['dev/css*/*.css', 'dev/css*/**/*.css', 'dev/template*/*.html', 'dev/template*/**/*.html'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('dev-easy'));
});

gulp.task('copy-backend-images', ['copy-backend'], function () {
    return gulp.src(['dev/images*/**'])
        .pipe(gulp.dest('dev-easy'));
});

gulp.task('cssmin', ['copy'], function () {
    return gulp.src('dev/css/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('debug', ['less2css', 'autoprefixer']);

gulp.task('dev', ['less2css', 'autoprefixer', 'cssver', 'copy']);

//方便后台找页面用的任务
gulp.task('dev-easy', ['less2css', 'autoprefixer', 'cssver', 'copy', 'copy-backend', 'copy-backend-images']);

gulp.task('build', ['less2css', 'autoprefixer', 'cssver', 'copy', 'cssmin']);