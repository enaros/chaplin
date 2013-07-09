module.exports = class Hole extends StackMob.Model
	
	_.extend @prototype, Backbone.Validation.mixin

	schemaName: 'hole'
	
	validation:
		video:
			required: yes 
			pattern: 'url'
			msg: 'enter a valid url'