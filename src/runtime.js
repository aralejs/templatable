define(function(require, exports, module) {

  var $ = require('$');

  module.exports = {

    templateHelpers: {},

    // override widget
    // initialize this.element from template
    parseElementFromTemplate: function() {
      var html = this._compile();
      this.element = html ? $(html) : null;
    },

    // recompile template
    compile: function(model) {
      var html = this._compile(model);
      var innerHTML = html.replace(/^\s*<.+?>(.+)<\/.+?>\s*$/, '$1');
      this.element.html(innerHTML);
    },

    _compile: function(model) {
      var fn = this.get('template');
      if (!fn) {
        return '';
      }

      model = model || this.get('model') || {};

      return fn(model, {
        helpers: this.templateHelpers
      });
    }
  };
});
