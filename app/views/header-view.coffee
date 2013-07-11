View = require 'views/base/view'
template = require 'views/templates/header'
Chaplin = require 'chaplin'

mediator = Chaplin.mediator

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
		@subscribeEvent 'loginSuccess', @loginSuccess
		@subscribeEvent 'loginFailed', @loginFailed
		@subscribeEvent '!router:route', @routeChanged
		# @subscribeEvent 'logoutSuccess', @logoutSuccess
		@initButtons()

	initButtons: ->
		@delegate 'submit', '#login-form', @login
		@delegate 'click', '#logout-form button', @logout
		@delegate 'click', 'li', @click
		@delegate 'click', '.brand', -> @selectMenuItem @$('ul li:first')

	routeChanged: (path, opts) ->
		console.log path
		item = path.substr(1)
		item = 'list' if item is ""
		@selectMenuItem @$(".#{item}")

	login: (e) ->
		e.preventDefault()
		console.log 'login'
		mediator.publish 'loginAttempt', @$('#login-form input').val()

	loginFailed: ->
		@$('#login-form').addClass 'error'
		@$('#login-form input').select()

	loginSuccess: ->
		@$('#login-form').hide().removeClass 'error'
		@$('#logout-form').fadeIn()
		console.log 'loginSuccess'

	logout: ->
		@$('#logout-form').hide()
		@$('#login-form').fadeIn()
		mediator.publish 'logoutAttempt'

	click: (e) ->
		e.preventDefault()
		@selectMenuItem $(e.currentTarget)
		
	selectMenuItem: (el) ->
		@$('ul').attr 'class', 'nav' # remove the css class select-{{route}}
		@$('ul li').removeClass 'active'
		el.addClass 'active'

	getTemplateData: ->
		route: @route.action
		showLogin: if mediator.user then "hide" else ""
		showWelcome: if mediator.user then "" else "hide"