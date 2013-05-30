define("arale/templatable/0.9.0/templatable",["$","gallery/handlebars/1.0.2/handlebars"],function(e,t,l){function r(e){return s(e)?null:p(n(e))}function a(e,t){if(e){var l=e.find(t);if(0===l.length)throw Error("Invalid template selector: "+t);return i(l.html())}}function n(e){return e.replace(/({[^}]+}})/g,"<!--$1-->").replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g," data-templatable-$1=$2$3$2")}function i(e){return e.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g,"$1").replace(/data-templatable-/gi,"")}function s(e){return"function"==typeof e}var p=e("$"),o=e("gallery/handlebars/1.0.2/handlebars"),m={};l.exports={templateHelpers:null,templateObject:null,parseElementFromTemplate:function(){var e,t=this.get("template");/^#/.test(t)&&(e=document.getElementById(t.substring(1)))&&(t=e.innerHTML,this.set("template",t)),this.templateObject=r(t),this.element=p(this.compile())},compile:function(e,t){e||(e=this.get("template")),t||(t=this.get("model")),t.toJSON&&(t=t.toJSON());var l=this.templateHelpers;if(l)for(var r in l)l.hasOwnProperty(r)&&o.registerHelper(r,l[r]);var a=s(e)?e:m[e];a||(a=m[e]=o.compile(e));var n=a(t);if(l)for(r in l)l.hasOwnProperty(r)&&delete o.helpers[r];return n},renderPartial:function(e){var t=a(this.templateObject,e);return t?this.$(e).html(this.compile(t)):this.element.html(this.compile()),this}};var c=o.compile;o.compile=function(e){return s(e)?e:c.call(o,e)}});
