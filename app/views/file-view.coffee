View = require 'views/base/view'

module.exports = class FileView extends View

	backgroundImageSelector: '.img'
	# file related methods
	# ---------------------------------------------------------------------------------------------------------
	dropFile: (e) ->
		@dragOver e
		@photo e.originalEvent.dataTransfer.files[0]
		console.log 'drop'

	dragOver: (e) ->
		e.originalEvent.stopImmediatePropagation()
		e.originalEvent.stopPropagation()
		e.originalEvent.preventDefault()
		if e.type is "dragover"
			@$el.find('.drag-drop').css 'opacity', .9
		else
			@$el.find('.drag-drop').css 'opacity', 0
		
	fileInput: (ev) ->
		@photo ev.target.files[0]

	photo: (file) ->
		reader = new FileReader()
		reader.onload = @readerOnLoad(file)
		fileContent = reader.readAsDataURL(file)

	readerOnLoad: (theFile) =>
		(e) =>
			# e.target.result will return "data:image/jpeg;base64,[base64 encoded data]...".
			# We only want the "[base64 encoded data] portion, so strip out the first part
			base64Content = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length)
			fileName = theFile.name
			fileType = theFile.type

			@model.setBinaryFile('photo', @model.get('id'), fileType, base64Content)
			@model.save()
			@$el.find(@backgroundImageSelector).css 'background-image', "url(#{e.target.result})"