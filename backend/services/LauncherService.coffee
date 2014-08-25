path = require 'path'
child_process = require 'child_process'

class LauncherService
  constructor: ()->
    @processInfo = null

  launch: (cmd)->
    throw "Another process already running" if @processInfo isnt null

    @processInfo = child_process.exec cmd

    @processInfo.stdout.on 'data', (chunk) ->
      console.warn "RECEIVED : #{chunk}"

    @processInfo.stderr.on 'data', (chunk) ->
      console.error "ERROR : #{chunk}"

    self = this
    @processInfo.on 'close', (exitCode, signal)->
      console.log "CLOSE : #{exitCode} :: #{signal}"
      self.processInfo = null

  killCurrentProcess: ()->
    @processInfo?.kill('SIGKILL')



module.exports = new LauncherService()