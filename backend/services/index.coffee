
config = new ((require "./AppConfig").AppConfig)("mmc")

# Services Mapping
module.exports =
  mediaFinder: require "./MediaFinder.coffee"
  config: config
  resources:
    manager: new ((require "./ResourceManager").ResourceManager)(config.data.resources)
    fs: (require "./FileSystemResource.js").FileSystemResource
  launcher: require "./Launcher.coffee"
