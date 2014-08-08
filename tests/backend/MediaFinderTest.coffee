should = require "should"

{ MediaFinder } = require "../../backend/MediaFinder.coffee"

describe('MediaFinder', () ->
	describe('#find', () ->
		
		it('should return a non null list of files', () ->
			new MediaFinder().find('./', (medias) ->
				medias.should.not.be.null
			)
		)
		
		it('should return an empty list on empty directory', () ->
			new MediaFinder().find('unknown_directory', (medias) ->
				medias.should.be.empty
			)
		)
	)
)	
			

			
