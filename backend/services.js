const coffee = require("coffee-script");
require('coffee-script/register');
const finder = require("./MediaFinder.coffee");

const services = {};

services.mediaFinder = new finder.MediaFinder();

services.test = function() {
    console.log("Test success");
}

exports.installmmc = function() {
    window.mmc = services;
    console.log("mmc global object installed.");
};
