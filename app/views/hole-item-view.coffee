View = require 'views/base/view'
template = require 'views/templates/hole-item'

module.exports = class HoleItemView extends View
	# autoRender: yes
	template: template
	tagName: 'li'
	className: 'hole-item'

	listen:
		'validated:invalid model': 'invalidModel'
		'validated:valid model': 'validModel'

	initialize: ->
		super
		@delegate 'click', '.remove-video', @removeItem
		@delegate 'click', '.open-video', -> window.open @model.get 'video'
		@delegate 'focus', 'span', (e) -> $(e.currentTarget).text @model.get 'video'
		@delegate 'blur', 'span', (e) -> 
			@model.set video: $(e.currentTarget).text()
			@model.save()
			index = _.findIndex(@model.collection.models, @model) + 1
			$(e.currentTarget).text "video #{index}"

	render: ->
		super
		# Backbone.Validation.bind(@)
		
	removeItem: (e) -> 
		e.preventDefault()
		@$el.slideUp => @model.destroy()

	getTemplateData: ->
		# console.log @model.collection.models, @model, _.findIndex(@model.collection.models, @model)
		_.extend @model.attributes, index: _.findIndex(@model.collection.models, @model) + 1

	invalidModel: (model, err) ->
		@$el.addClass 'alert-error'
	
	validModel: (model) ->
		@$el.removeClass 'alert-error'