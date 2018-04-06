const gulp = require('gulp')
const browserify = require('browserify')
const Path = require('path')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const shelljs = require('shelljs')
const babelify = require('babelify')
const babel = require('gulp-babel')

gulp.task('clean', () =>{
  shelljs.rm(Path.join(__dirname, 'build', '*'))
})

gulp.task('bundle:node', () => {
  gulp.src(Path.join(__dirname, 'js', '*'))
      .pipe(babel())
      .pipe(gulp.dest(Path.join(__dirname, 'build')))
})

gulp.task('bundle:browser', () => {
  browserify({
    entries: Path.join(__dirname, 'browser.js'),
  })
    .transform(babelify)
    .bundle()
    .pipe(source('extImgColor.min.js'))
    .pipe(buffer())
    .pipe(gulp.dest(Path.join(__dirname, 'build')))
})

gulp.task('build', ['clean', 'bundle:node', 'bundle:browser'])
