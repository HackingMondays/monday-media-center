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
        var locations = [];
        [undefined, this.home].map((prefix) => {
            [name, "." + name].map( (filename) => {
                ["", "rc", ".yaml", ".js", "js"].map( (extension) => {
                    locations.push(prefix?path.join(prefix, filename + extension) : filename + extension);
                })
            })
        });

        this.configFilePath = locations.filter((path) => fs.existsSync(path)).reduce((left,right) => left?left:right, undefined);
        console.log("config paths", this.configFilePath);

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