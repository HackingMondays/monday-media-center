should = require "should"

mediaFinder = require "../../../backend/services/MediaFinder.coffee"

describe 'MediaFinder', () ->
	describe '#find', () ->
		
		it 'should return a non null list of files', ->
			mediaFinder.find './', (medias) ->
				medias.should.not.be.null

		it 'should return an empty list on empty directory', ->
			mediaFinder.find 'unknown_directory', (medias) ->
				medias.should.be.empty
