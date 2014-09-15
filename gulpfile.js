var gulp = require('gulp'),
    downloadatomshell = require('gulp-download-atom-shell'),
    shell = require('shelljs');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
      version: '0.16.2',
      outputDir: 'binaries'
    }, cb);
});
gulp.task('run', function(cb) {
    shell.exec('binaries/Atom.app/Contents/MacOs/Atom backend/main.js',function(code){
        if (code != 0) {
            console.error("Atom install returned " + code + "\n");
        }
        cb();
    });
});

gulp.task('default', ['downloadatomshell','run']);
