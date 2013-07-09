View = require 'views/base/view'
template = require 'views/templates/header'

module.exports = class HeaderView extends View
	autoRender: yes
	className: 'navbar'
	region: 'header'
	id: 'header'
	template: template

	# Expects the serviceProviders in the options
	initialize: (options) ->
		super
		@route = options.route
		console.log @route
		@initButtons()

	initButtons: ->
		@delegate 'click', 'li', @click
		@delegate 'click', '.brand', -> @selectMenuItem @$('ul li:first')

	click: (e) ->
		e.preventDefault()
		@selectMenuItem $(e.currentTarget)
		
	selectMenuItem: (el) ->
		@$('ul').attr 'class', 'nav' # remove the css class select-{{route}}
		@$('ul li').removeClass 'active'
		el.addClass 'active'

	getTemplateData: ->
		route: @route.action