var gulp = require('gulp'),
    downloadatomshell = require('gulp-download-atom-shell'),
    shell = require('shelljs'),
    os = require('os');

var atomShellLocation = "atom-shell-bin";
var atomShellVersion = "0.16.2";

gulp.task('clean', function(){
    shell.rm("-rf", atomShellLocation);
    shell.rm("-rf", ".cache");
});

gulp.task('downloadatomshell', function(cb){
    if (shell.test('-d', atomShellLocation) == false) {
        downloadatomshell({
            version: atomShellVersion,
            outputDir: atomShellLocation,
            downloadDir: ".cache"
        }, function() {
            if (shell.test('-f', atomShellLocation + "/atom")) { // mostly useful for linux
                shell.chmod("u+x", atomShellLocation + "/atom")
            }
            cb();
        });
    } else {
        cb();
    }
});
gulp.task('run', ["downloadatomshell"], function(cb) {
    var atomCmd;
    switch(os.platform()) {
        case 'darwin':
            atomCmd = "binaries/Atom.app/Contents/MacOs/Atom";
            break;
        case 'win32':
            atomCmd = atomShellLocation + "/atom.exe";
            break;
        case 'linux':
        default:
            atomCmd = atomShellLocation + "/atom";
            break;
    }

    shell.exec(atomCmd + ' backend/main.js',function(code){
        if (code != 0) {
            console.error("Atom install returned " + code + "\n");
        }
        cb();
    });
});

gulp.task('default', ['run']);
