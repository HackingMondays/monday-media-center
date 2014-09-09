import { AppConfig } from "./AppConfig.js";
import { CommandLauncher } from "../launchers/CommandLauncher.js";
import { ResourceManager } from "../resources/ResourceManager.js";
import { LauncherService } from "./LauncherService.js";

import { FileSystemResource } from "../resources/FileSystemResource.js";

var config = new AppConfig("mmc");
var launcherService = new LauncherService(config.find("launchers"));

module.exports = {
    config: config,
    resources: {
        manager: new ResourceManager(config.data.resources, launcherService),
        fs: FileSystemResource
    },
    launchers: launcherService
};