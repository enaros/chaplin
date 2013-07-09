Model = require 'models/base/model'
Chaplin = require 'chaplin'

module.exports = class GCCourse extends Model
	_.extend @prototype, Chaplin.SyncMachine

	schemaName: 'golfcourse'
	defaults:
		name: 'Title'
		photo: ''
		address: 'address'
		description: "lorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emlorem ipsum dolorem at emhola"
	
	save: ->
		@unset 'photo' unless @get('photo')?.substr(0,7) is 'Content' # if it is not base64 encoded
		@unset 'location' unless @get('location')?.lat and @get('location')?.lon
		@unset 'holes'
		console.log 'save'
		super