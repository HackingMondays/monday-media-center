import { AbstractResource } from "./AbstractResource.js";
import { FileSystemResource } from "./FileSystemResource.js";

class InvalidResource extends AbstractResource {
    constructor() {
        super("invalid://invalid");
    }

    list(callback) {
        callback(false, this);
    }

    get label() {
        return "Invalid resource";
    }
}

/**
 * The ResourceManager is responsible for looking a resource up by its name.
 * The resources are sourced from the MMC config file, or from any other source.
 * @TODO add source storage (to add/edit/remove resource from the runtime)
 */
export class ResourceManager {

    constructor(resources) {
        this.resources = resources;
    }

    find(name) {
        var descriptor = this.resources[name];
        if (descriptor) {
            if (descriptor.type == "fs") {
                return new FileSystemResource(descriptor.parameter, descriptor.options);
            }
            return new InvalidResource();
        }
    }
}
