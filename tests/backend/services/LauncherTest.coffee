should = require "should"

launcherService = require '../../../backend/services/Launcher.coffee'

describe "when i launch this stupid test i get logs", ->
  it "must launch the process", (done)->
    launcherService.launch("./tests/backend/services/launcher/launcherTest.sh")

    launcherService.processInfo.stdout.on 'data', (data) ->
      data.should.equal "Toto\n"
      done()

  it "must stop the process", (done) ->
    launcherService.processInfo.on 'close', ->
      should(launcherService.processInfo).be.null
      done()
    launcherService.killCurrentProcess()

  it "when i register a launcher i'm able to launch the returned command", (done) ->
    launcherService.register (path, mime) ->
      'sleep 0.1; echo "Toto";'

    launcherService.launchFor
      path: "./tests/backend/launcherTest.sh"
      type: "TOTO/TOTO"

    launcherService.processInfo.stdout.on 'data', (data) ->
      data.should.equal "Toto\n"
      done()