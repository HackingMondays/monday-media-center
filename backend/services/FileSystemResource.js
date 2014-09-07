var fs = require("fs");
var path = require('path');
var URL = require('url');
var async = require("async");

import { AbstractResource } from "./AbstractResource.js";

/**
 * The FileSystemResource class provides a resource working specifically with file paths.
 * Note that an error is raised if the provided url is neither a file: or a local path.
 */
export class FileSystemResource extends AbstractResource {

    constructor(url) {
        if (typeof url == "string" && !url.startsWith("file:")) {
            url = URL.format({ protocol: "file:", pathname: path.resolve(url), slashes: true, host: "" });
        }
        super(url);

        if (this.parsedURL.protocol != 'file:') {
            throw new Error("Url " + url + " is not a local path");
        }
    }

    list(callback) {
        async.waterfall([
            (callback) => fs.stat(this.parsedURL.path, callback),
            (statObj, callback) => callback(!statObj.isDirectory(), this.parsedURL.path),
            (path, callback) => fs.readdir(path, callback),
            (files, callback) => {
                callback(false, files.map((file) =>  new FileSystemResource(this.parsedURL.protocol + "//" + path.join(this.parsedURL.path, file))));
            }
        ], function(err, result) {
            callback(err, result);
        });
    }

    execute(callback) {
        // TODO: call the launcher is resource is a file, list() otherwise
    }

    get label() {
        return path.basename(this.parsedURL.path);
    }

}
