path = require 'path'
child_process = require 'child_process'

class Launcher
  constructor: ()->
    @processInfo = null
    @launchers = []

  launch: (cmd)->
    throw "Another process already running" if @processInfo isnt null

    @processInfo = child_process.exec cmd

    @processInfo.stdout.on 'data', (chunk) =>
      console.warn "RECEIVED : #{chunk}"

    @processInfo.stderr.on 'data', (chunk) =>
      console.error "ERROR : #{chunk}"

    @processInfo.on 'close', (exitCode, signal) =>
      console.log "CLOSE : #{exitCode} :: #{signal}"
      @processInfo = null

  killCurrentProcess: ()->
    @processInfo?.kill('SIGKILL')

  register: (launcher) ->
    @launchers.push launcher

  launchFor: (file) ->
    @launchers.some (launcher) =>
      cmd = launcher(file.path, file.type)
      this.launch(cmd) if cmd isnt null

module.exports = new Launcher()