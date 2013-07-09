ColectionView = require 'views/base/collection-view'
HoleItemView = require 'views/hole-item-view'
template = require 'views/templates/holes-list'

module.exports = class HolesListView extends ColectionView
	autoRender: yes
	template: template
	listSelector: 'ul'
	itemView: HoleItemView

	emptyValue: 'http://vimeo.com'

	listen:
		'add collection': 'addRelationship'
		'destroy collection': 'removeRelationship'

	initialize: (options) ->
		@parentModel = options.parentModel
		super
		
		# tengo que encontrar porque no puedo agarrar e evento 
		# que se trigerea al agregar un intem a la coleccion
		Backbone.Validation.bind @

		@delegate 'click', '.btn-add', @addItem

	addItem: ->
		item = video: @$el.find('input[type=text]').val()
		@collection.create item, wait: yes

	addRelationship: (model) ->
		@$el.find('input[type=text]').val @emptyValue
		@parentModel.appendAndSave 'holes', [model.get 'hole_id']

	removeRelationship: (model) ->
		@parentModel.deleteAndSave 'holes', [model.get 'hole_id'], StackMob.SOFT_DELETE
		@$el.find('.holes-list .text').each (i,o) -> $(o).text("video #{i+1}")

	getTemplateData: ->
		defaultValue: @emptyValue