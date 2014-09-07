var fs = require("fs");
var path = require('path');
var yaml = require("js-yaml");

function loadYaml(path) {
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
}

function loadJson(path) {
    var content = fs.readFileSync(path, "utf8");
    return content?JSON.parse(content):{};
}

export class AppConfig {

    constructor(name) {
        console.log("Creating AppConfig", name, path.join(this.home, name));
        this.configFilePath = [
            path.join(this.home, name),
            path.join(this.home, name + ".yaml"),
            path.join(this.home, name + ".js"),
            path.join(this.home, name + "js"),
            path.join(this.home, name + "rc"),
            path.join(this.home, "." + name),
            path.join(this.home, "." + name + ".yaml"),
            path.join(this.home, "." + name + ".js"),
            path.join(this.home, "." + name + "js"),
            path.join(this.home, "." + name + "rc"),
            name,
            name + ".yaml",
            name + ".js",
            name + "js",
            name + "rc",

        ].filter((path) => fs.existsSync(path)).reduce((left,right) => left?left:right, undefined);

        if (this.configFilePath) {
            this.data = this.configFilePath.endsWith(".js")?loadJson(this.configFilePath):loadYaml(this.configFilePath);
            console.log("Config loaded: ", this.data);
        } else {
            console.error("No configuration file found in " + this.home);
            this.data = {};
        }
    }

    find(name) {
        return this.data[name];
    }

    get home() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    }
}