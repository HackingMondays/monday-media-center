fs = require('fs')
mime = require('mime')

class MediaFinder
  find: (directory, callback) ->
    fs.readdir directory, (err, files) ->
      newFiles = []
      newFiles = ( newMedia fs.realpathSync(file) for file in files ) if err is null
      callback(newFiles)

  newMedia = (realPath) ->
    path: realPath
    type: mime.lookup(realPath)

module.exports = new MediaFinder()