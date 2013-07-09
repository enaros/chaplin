Model = require 'models/base/model'
Collection = require 'models/base/collection'
GCourse = require 'models/gcourse'
Chaplin = require 'chaplin'

module.exports = class GCCollection extends StackMob.Collection
	_.extend @prototype, Chaplin.SyncMachine
	_.extend @prototype, Chaplin.EventBroker
	model: GCourse

	initialize: ->
		super
		# Will be called on every state change
		@syncStateChange @announce
		@fetchAll()
	
	fetchAll: ->
		@beginSync()
		q = new StackMob.Collection.Query();
		q.setExpand(1).orderDesc('createddate')
		@query(q, { success: (c) => @finishSync() })

	announce: (collection, status) =>
		@publishEvent "collection-#{status}", {}