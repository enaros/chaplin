Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'
AboutView = require 'views/about-view'
ConfigurationView = require 'views/configuration-view'
Configuration = require 'models/configuration'
GCCollection = require 'models/gc-collection'

module.exports = class HomeController extends Controller
	title: 'SteadyMotion'
	
	index: ->
		@courses = new GCCollection()
		@view = new HomePageView region: 'main', collection: @courses

	conf: ->
		@view = new ConfigurationView 
			region: 'main', 
			model: new Configuration
	
	about: ->
		@view = new AboutView region: 'main'