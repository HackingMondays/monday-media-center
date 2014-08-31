// Register CoffeeScript require wrapper
require('coffee-script/register');

exports.installmmc = function () {
    window.mmc = require('./services');
    console.log("mmc global object installed.");
};

process.on("uncaughtException", function(err) { console.error("UNCAUGHT EXCEPTION ", err); });
