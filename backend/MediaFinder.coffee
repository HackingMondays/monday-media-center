fs= require('fs')
mime= require('mime')


class MediaFinder

	find: (directory,callback) -> 
		fs.readdir(directory, (err, files)->
			return [] if err 
			callback(newMedia(fs.realpathSync(file))) for file in files)

	newMedia= (realPath) ->
		path: realPath
		type: mime.lookup(realPath)


# new XBMCWebListMediaFiles().listMedia("./",console.log)


module.exports.MediaFinder = MediaFinder