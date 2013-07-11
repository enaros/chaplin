Controller = require 'controllers/base/controller'
Chaplin = require 'chaplin'

mediator = Chaplin.mediator

module.exports = class SessionsController extends Controller
	initialize: (opt) ->
		@user = new StackMob.User({ username: 'emiliano' });
		
		@user.isLoggedIn
			yes: =>
				mediator.user = @user
				mediator.publish 'loginSuccess', @user
			
			no: ->
				console.log("Not logged in.")

		@subscribeEvent 'loginAttempt', @loginAttempt
		@subscribeEvent 'logoutAttempt', @logoutAttempt

	loginAttempt: (password) ->
		@user.set 'password', password
		@user.login false,
			success: (model) -> 
				mediator.user = model
				mediator.publish 'loginSuccess', mediator.user

			error: (model, response) ->
				mediator.publish 'loginFailed', model, response

	logoutAttempt: ->
		@user.logout()
		mediator.user = null
		mediator.publish 'logoutSuccess'