should = require "should"

launcherService = require '../../backend/services/LauncherService.coffee'

describe "when i launch this stupid test i get logs", () ->
  it "must launch the process", (done)->
    launcherService.launch("./tests/backend/launcherTest.sh")

    launcherService.processInfo.stdout.on 'data', ()->
      done()

  it "must stop the process", (done) ->
    launcherService.processInfo.on 'close', ()->
      should(launcherService.processInfo).be.null
      done()
    launcherService.killCurrentProcess()

