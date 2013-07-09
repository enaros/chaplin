FileView = require 'views/file-view'
template = require 'views/templates/configuration'

module.exports = class ConfigurationView extends FileView
	template: template
	className: 'ipad'
	backgroundImageSelector: '.ipad-screen'
	# autoRender: yes

	initialize: ->
		super
		@subscribeEvent 'model-synced', (e) => @render()
		
		@delegate 'dragover', '.drag-drop', @dragOver
		@delegate 'drop', '.drag-drop', @dropFile
		@delegate 'dragleave', '.drag-drop', @dragOver
		@delegate 'change', 'input[type=file]', @fileInput
		@delegate 'click', '.edit-pic', -> @$el.find("input[type=file]").click()

		@delegate 'click', '.play', (e) -> window.open @model.get $(e.currentTarget).parent().attr('data')
		@delegate 'click', '.edit', @edit
		@delegate 'click', '#myModal .btn-primary', @save

	getTemplateData: (model) ->
		console.log @model.attributes
		@model.attributes

	edit: (e) ->
		attr = $(e.currentTarget).parent().attr('data')
		modal = @$('#myModal')
		modal.find('#myModalLabel').text(attr)
		modal.find('textarea').val(@model.get attr).attr('data', attr)
		modal.modal()

	save: (e) ->
		modal = @$('#myModal')
		attr = modal.find('#myModalLabel').text()
		val = modal.find('textarea').val()
		@model.set attr, val
		@model.save()
		modal.modal('hide')