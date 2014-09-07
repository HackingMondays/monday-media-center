process.on("uncaughtException", function(err) {
    console.log("Uncaught Exception in Node context: " + err.message);
    process.stdout.write(err.stack + "\n");
});

// Register CoffeeScript require wrapper
require('coffee-script/register');

var traceur = require("traceur");
traceur.require.makeDefault(function(filename) {
    return filename.endsWith(".js") && filename.indexOf('node_modules')==-1;
});

exports.installmmc = function () {
    window.mmc = require('./services');
};
