var mime = require('mime');
var URL = require("url");

/**
 * AbstractResource provides a default implementation for the common methods of a resource object.
 */
export class AbstractResource {

    constructor(url) {
        this.parsedURL = URL.parse(url, true);
    }

    get url() {
        return this.parsedURL.href;
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

}