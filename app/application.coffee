Chaplin = require 'chaplin'
routes = require 'routes'
SessionController = require 'controllers/session-controller'

# The application object.
module.exports = class Application extends Chaplin.Application
	# Set your application name here so the document title is set to
	# “Controller title – Site title” (see Chaplin.Layout#adjustTitle)
	title: 'Brunch example application'

	initialize: ->
		super

		# Initialize core components.
		# ---------------------------

		# Register all routes.
		# You might pass Router/History options as the second parameter.
		# Chaplin enables pushState per default and Backbone uses / as
		# the root per default. You might change that in the options
		# if necessary:
		# @initRouter routes, pushState: false, root: '/subdir/'
		@initRouter routes

		# Dispatcher listens for routing events and initialises controllers.
		@initDispatcher controllerSuffix: '-controller'

		# Layout listens for click events & delegates internal links to router.
		@initLayout()

		# Composer grants the ability for views and stuff to be persisted.
		@initComposer()

		# Mediator is a global message broker which implements pub / sub pattern.
		@initMediator()

		# Application-specific scaffold
		@initControllers()

		# Actually start routing.
		@startRouting()

		# Freeze the application instance to prevent further changes.
		Object.freeze? this

	initControllers: ->
		# These controllers are active during the whole application runtime.
		new SessionController()

	# Create additional mediator properties.
	initMediator: ->
		# Add additional application-specific properties and methods
		Chaplin.mediator.user = null

		# Seal the mediator.
		Chaplin.mediator.seal()
