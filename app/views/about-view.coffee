View = require 'views/base/view'
template = require 'views/templates/about'

module.exports = class AboutView extends View
  template: template
  autoRender: yes