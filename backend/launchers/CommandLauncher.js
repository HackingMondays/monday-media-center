var shell = require('shelljs');

export class CommandLauncher {

    constructor(cmdline, options) {
        this.cmdline = cmdline;
        this.options = options;
    }

    run(resource, callback) {
        var commandline = this.cmdline.replace("%url%", "'"+resource.url+"'").replace("%path%", "'"+resource.path+"'");
        console.log("Running", commandline);
        shell.exec(commandline, {silent: true}, (code, output) => {
            if (code != 0) {
                console.log("Command [" + commandline + "] returned " + code + "\n" + output + "\n");
            }
            callback(code===0);
        });
    }

}