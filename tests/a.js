// <div>{{> testPartials}}</div> 编译后
const Handlebars = require("handlebars-runtime");
console.log(Handlebars);
const template = Handlebars.template;
const templates = Handlebars.templates = Handlebars.templates || {};
module.exports = template(function(e, a, t, r, s) {
  this.compilerInfo = [4, ">= 1.0.0"], t = this.merge(t, e.helpers), r = this.merge(r, e.partials), s = s || {};
  var l, i = "",
    n = this;
  return i += "<div>", l = n.invokePartial(r.testPartials, "testPartials", a, t, r, s), (l || 0 === l) && (i += l), i += "</div>\n"
});
