var mime = require('mime');
var URL = require("url");

/**
 * AbstractResource provides a default implementation for the common methods of a resource object.
 */
export class AbstractResource {

    constructor(url, options) {
        this.parsedURL = URL.parse(url, true);
        this.options = options;
    }

    get url() {
        return this.parsedURL.href;
    }

    get path() {
        return this.parsedURL.path;
    }

    get label() {
        return this.parsedURL.path;
    }

    get mimeType() {
        return mime.lookup(this.parsedURL.path);
    }

    execute(callback) {
        return callback(true);
    }

    list(callback) {
        return callback(true);
    };

    addMetaData(name, blob) {
        // todo
    }

    getMetaData(name) {
        // todo
    }

    runLauncher(callback) {
        var launcherService = require("../services").launchers;
        if (this.options.launcher) {
            var launcher = launcherService.get(this.options.launcher);
            launcher.run(this, callback);
        } else {
            console.err("no launcher");
            callback(true);
        }
    }

}