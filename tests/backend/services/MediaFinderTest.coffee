should = require "should"

mediaFinder = require "../../../backend/services/MediaFinder.coffee"

describe 'MediaFinder', () ->
  describe '#find', () ->

    it 'should return a non null list of files', (done) ->
      mediaFinder.find './', (medias) ->
        medias.should.be.an.instanceOf Array
        medias.should.not.be.empty
        done()

    it 'should return an empty list on empty directory', (done) ->
      mediaFinder.find 'unknown_directory', (medias) ->
        medias.should.be.an.instanceOf Array
        medias.should.be.empty
        done()