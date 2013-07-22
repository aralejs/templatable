// <div>{{> testPartials}}</div> 编译后
define(function(require, b, c) {
  var d = require("runtime"), e = d.template;
  c.exports = e(function(a, b, c, d, e) {
    this.compilerInfo = [3, ">= 1.0.0-rc.4"], c = c || {};
    for (var f in a.helpers) c[f] = c[f] || a.helpers[f];
    d = d || a.partials, e = e || {};
    var g, h = "", i = this;
    return h += "<div>", g = i.invokePartial(d.testPartials, "testPartials", b, c, d, e), (g || 0 === g) && (h += g), h += "</div>";
  });
});