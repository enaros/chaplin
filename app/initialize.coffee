Application = require 'application'

# Initialize the application on DOM ready event.
$ ->
  window.App = new Application
  App.initialize()
