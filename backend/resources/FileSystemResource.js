var fs = require("fs");
var path = require('path');
var URL = require('url');
var async = require("async");
var extend = require("extend");

import { AbstractResource } from "./AbstractResource.js";
/**
 * The FileSystemResource class provides a resource working specifically with file paths.
 * Note that an error is raised if the provided url is neither a file: or a local path.
 *
 * Accepted options:
 * chroot: true/false to chroot from this resource any children
 * chrootBase: the directory where to chroot from. Automatically set when chroot is enabled and not already defined.
 *
 */
export class FileSystemResource extends AbstractResource {

    constructor(url, options, label) {
        super(normalizeAsUrl(url), options || {chroot: true});
        this.forcedLabel = label;

        this.parsedURL.path = cleanPath(this.parsedURL.path);

        if (this.options.chroot || this.options.chrootBase) {
            this.options.chrootBase = cleanPath(this.options.chrootBase || this.parsedURL.path);
        }

        if (this.parsedURL.protocol != 'file:') {
            throw new Error("Url " + url + " is not a local path");
        }
    }

    list(callback) {
        var defaultOptions = {
            chrootBase: this.options.chrootBase
        };
        async.waterfall([
            (callback) => fs.stat(this.parsedURL.path, callback),
            (statObj, callback) => callback(!statObj.isDirectory(), this.parsedURL.path),
            (path, callback) => fs.readdir(path, callback),
            (files, callback) => {
                callback(false, files.map((file) =>  {
                    var url = this.parsedURL.protocol + "//" + path.resolve(this.parsedURL.path, file);
                    return new FileSystemResource(url, extend({}, this.options, {label: null}))
                }));
            }
        ], (err, result) => {
            if (!err && !this.options.chroot && (this.parsedURL.path != this.options.chrootBase)) {
                result = [
                    new FileSystemResource(path.resolve(this.parsedURL.path, ".."), extend({}, this.options), this.options.parentLabel||"[parent]")
                ].concat(result);
            }
            callback(err, result);
        });
    }

    execute(callback) {
        this.list((err, files) => {
            if (err) {
                // try executing a launcher
                this.runLauncher(callback);
            } else {
                callback(false, files);
            }
        });
    }

    get label() {
        return this.forcedLabel?this.forcedLabel:path.basename(this.parsedURL.path);
    }

}

function normalizeAsUrl(url) {
    if (typeof url == "string" && !url.startsWith("file:")) {
        url = URL.format({ protocol: "file:", pathname: path.resolve(url), slashes: true, host: "" });
    }
    return url;
}

function cleanPath(filepath) {
    filepath = path.normalize(filepath);
    filepath = path.resolve(filepath);
    return filepath;
}