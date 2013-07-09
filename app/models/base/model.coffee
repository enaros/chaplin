Chaplin = require 'chaplin'

module.exports = class Model extends StackMob.Model
  # Mixin a synchronization state machine
  # _(@prototype).extend Chaplin.SyncMachine

  # make get 'id' generic
  get: (attr) ->
  	if attr is 'id'
  		attr = _.find _.keys(@attributes), (i) -> i.substr(-3) is "_id"
  	super