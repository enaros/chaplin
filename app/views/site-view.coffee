View = require 'views/base/view'
template = require 'views/templates/site'

# Site view is a top-level view which is bound to body.
module.exports = class SiteView extends View
	container: 'body'
	id: 'site-container'
	regions:
		'#header-container': 'header'
		'#page-container': 'main'
	template: template

	initialize: ->
		super
		@delegate 'dragenter', (e) -> 
			e.originalEvent.stopImmediatePropagation()
			e.originalEvent.stopPropagation()
			e.originalEvent.preventDefault()
			#console.log 'enter', e.currentTarget
		
		@delegate 'dragleave', (e) -> 
			e.originalEvent.stopImmediatePropagation()
			e.originalEvent.stopPropagation()
			e.originalEvent.preventDefault()
			#console.log 'leave', e.currentTarget

	render: ->
		super
		console.log 'render siteview layout'