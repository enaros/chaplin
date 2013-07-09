Chaplin = require 'chaplin'
SiteView = require 'views/site-view'
HeaderView = require 'views/header-view'

module.exports = class Controller extends Chaplin.Controller
  beforeAction: (params, route) ->
    @compose 'site', SiteView
    @compose 'header', -> @view = new HeaderView route: route
