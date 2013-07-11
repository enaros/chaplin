View = require 'views/base/view'
FileView = require 'views/file-view'
HolesListView = require 'views/holes-list-view'
HolesCollection = require 'models/holes-collection'
template = require 'views/templates/compact'

module.exports = class CompactView extends FileView

	template: template
	# autoRender: yes
	tagName: 'li'
	className: 'span3'

	render: ->
		super
		# @$('.edit-pic').tooltip { placement:'right' }
		@subview 'holesList', new HolesListView 
			container: @$el.find('.back')
			collection: new HolesCollection @model.get 'holes' or new Array
			parentModel: @model
		
		@renderMap()

	initialize: (options) ->
		super
		@registerRegion 'holesList': '.back'
		@initButtons()

	initButtons: ->
		@delegate 'click', '.edit-pic', @click
		@delegate 'click', '.delete', @delete
		@delegate 'click', '.btn-map', @toggleMap
		@delegate 'click', '.btn-toggle-holes', -> @$el.toggleClass('flipped')
		
		@delegate 'blur', '.name', @valChange
		@delegate 'blur', '.description', @valChange
		@delegate 'blur', '.phone', @valChange
		@delegate 'blur', '.address', @updateAddress
		
		@delegate 'change', 'input[type=file]', @fileInput
		@delegate 'dragover', '.drag-drop', @dragOver
		@delegate 'drop', '.drag-drop', @dropFile
		@delegate 'dragleave', '.drag-drop', @dragOver

	# ---------------------------------------------------------------------------------------------------------
	updateAddress: (e) ->
		# if address has changed
		if $(e.currentTarget).text() isnt @model.get 'address'
			@valChange(e, false)
			@refreshMap(e)

	updateLocation: (location) ->
		latlon = new StackMob.GeoPoint location.lat(), location.lng()
		# if location has changed
		if latlon.lat isnt @model.get('location').lat and latlon.lon isnt @model.get('location').lon
			@model.set 'location', latlon.toJSON()
			@model.save()

	refreshMap: (e)-> 
		address = $(e.currentTarget).text()
		geocoder = new google.maps.Geocoder()

		if geocoder
			geocoder.geocode { 'address': address }, (results, status) =>
				@addMapMarker(results[0].geometry.location) if status is google.maps.GeocoderStatus.OK

	addMapMarker: (location) ->
		if @marker?
			@marker.setPosition(location)
		else
			@marker = new google.maps.Marker
				map: @map
				position: location
				cursor: 'pointer'
				draggable: true

		@map.setZoom 15
		@map.setCenter location
		@updateLocation location
	
		google.maps.event.addListener @marker, 'dragend', (obj) => 
			@updateLocation obj.latLng

		@marker.setAnimation(google.maps.Animation.BOUNCE)
		setTimeout ((e) => @marker.setAnimation(null)), 2000

	renderMap: ->
		if not @map
			latlon = new google.maps.LatLng(
				@model.get('location')?.lat or -34.60358190549192,
				@model.get('location')?.lon or 58.38167893068851
			)
			mapOptions =
				center: latlon
				zoom: 15
				disableDefaultUI: true
				zoomControl: true
				mapTypeId: google.maps.MapTypeId.ROADMAP

			@map = new google.maps.Map @$el.find('.map')[0], mapOptions
			@addMapMarker latlon if @model.get('location')?

	toggleMap: (e) ->
		@$el.find('.edit-pic').toggle()
		@$el.find('.map').toggle()
		google.maps.event.trigger @map, 'resize'
		@map.setCenter(@marker.getPosition()) if @marker?

	click: (e) ->
		e.preventDefault()
		el = $ e.currentTarget
		@$el.find("input[type=file]").click()

	valChange: (e, commitSave = true) -> 
		el = $(e.currentTarget)
		if el.text() isnt @model.get el.attr('class')
			@model.set el.attr('class'), el.text()
			@model.save() if commitSave

	delete: (e) =>
		e.preventDefault()
		if confirm 'Are you sure?'
			@$el.fadeOut => @model.destroy()