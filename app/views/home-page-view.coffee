template = require 'views/templates/home'
CollectionView = require 'views/base/collection-view'
GCourse = require 'models/gcourse'
CompactView = require 'views/compact-view'
Chaplin = require 'chaplin'

module.exports = class HomePageView extends CollectionView
	_.extend @prototype, Chaplin.EventBroker
	#autoRender: yes
	className: 'home-page row-fluid'
	template: template
	listSelector: 'ul'
	# Fallback content selector
	fallbackSelector: '.fallback'
	# Loading indicator selector
	loadingSelector: '.loading'
	# itemClass
	# itemView: CompactView

	initialize: ->
		super
		@delegate 'click', '.btn-add-gc', => @collection.create new GCourse, { at:0 }
		@subscribeEvent 'collection-synced', (e) -> 
			console.log 'collection synced!!'

	listen:
		'addedToDOM': -> console.log 'home-rendered'
		'visibilityChange': 'visibilityChange'

	visibilityChange: -> 
		# console.log @, 'home-visibilityChange'
		# $('.thumbnails').gridalicious({width:350, selector:'.item'})

	initItemView: (model) ->
		return new CompactView model:model