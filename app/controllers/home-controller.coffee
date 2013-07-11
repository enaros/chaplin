Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'
AboutView = require 'views/about-view'
ConfigurationView = require 'views/configuration-view'
Configuration = require 'models/configuration'
GCCollection = require 'models/gc-collection'
Chaplin = require 'chaplin'

mediator = Chaplin.mediator

module.exports = class HomeController extends Controller
	title: 'SteadyMotion'

	initialize: (opt) ->
		@subscribeEvent 'loginSuccess', => 
			console.log @, opt.route
			mediator.publish "!router:route", "/"

		@subscribeEvent 'logoutSuccess', => 
			mediator.publish "!router:route", "/about"

	index: ->
		return unless mediator.user

		@courses = new GCCollection()
		@view = new HomePageView region: 'main', collection: @courses

	conf: ->
		return unless mediator.user

		@view = new ConfigurationView 
			region: 'main', 
			model: new Configuration
	
	about: ->
		@view = new AboutView region: 'main'