
import { CommandLauncher } from "../launchers/CommandLauncher.js";

export class LauncherService {

    constructor(launcherConfig) {
        this.config = launcherConfig || {};
    }

    get(launcherName) {
        var cfg = this.config[launcherName];
        if (cfg) {
            switch(cfg.type) {
                case "commandline":
                    return new CommandLauncher(cfg.parameter);
                    break;
            }
        }
        return undefined;
    }

}