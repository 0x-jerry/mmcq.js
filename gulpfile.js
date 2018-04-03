const gulp = require('gulp')
const browserify = require('browserify')
const Path = require('path')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const shelljs = require('shelljs')
const babelify = require('babelify')

gulp.task('bundle:js', () => {
  shelljs.rm(Path.join(__dirname, 'build', '*'))

  browserify({
    entries: Path.join(__dirname, 'index.js'),
  })
    .transform(babelify)
    .bundle()
    .pipe(source('extImgColor.min.js'))
    .pipe(buffer())
    .pipe(gulp.dest(Path.join(__dirname, 'build')))
})
