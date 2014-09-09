
var config = new (require("./AppConfig")).AppConfig("mmc");
module.exports = {
    mediaFinder: require("./MediaFinder.coffee"),
    config: config,
    resources: {
        manager: new (require("./../resources/ResourceManager")).ResourceManager(config.data.resources),
        fs: (require("./../resources/FileSystemResource.js")).FileSystemResource
    },
    launcher: require("./Launcher.coffee")
};