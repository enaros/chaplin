Model = require 'models/base/model'
Chaplin = require 'chaplin'

module.exports = class Configuration extends Model
	_.extend @prototype, Chaplin.SyncMachine
	_.extend @prototype, Chaplin.EventBroker
	_.extend @prototype, Backbone.Validation.mixin

	schemaName: 'configuration'
	
	validation:
		sampleVideo:
			required: yes 
			pattern: 'url'
			msg: 'enter a valid url'

	initialize: ->
		super
		@set 'configuration_id', '3bd1565f741a48648bc320663ce6b579'
		@syncStateChange @announce
		@fetchConf()
	
	fetchConf: ->
		@beginSync()
		@fetch success: => @finishSync()

	announce: (model, status) =>
		@publishEvent "model-#{status}", {}
		console.log "model-#{status}"

	save: ->
		@unset 'photo' unless @get('photo')?.substr(0,7) is 'Content' # if it is not base64 encoded
		super