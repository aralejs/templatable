# 性能测试

- order: 2

------------------------------------

<button id="btn">Begin</button>
<div id="console-div"></div>
<div id="container">aaa</div>

````javascript
window.jQuery = require('spm-jquery');
var $ = window.jQuery;
var Widget = require('arale-widget');
var Templatable = require('arale-templatable');
// var Templatable = require('../dist/arale-templatable/1.0.0/index');

var MyWidget = Widget.extend({
    Implements: Templatable,
    template: '<p>{{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}} - {{a}}</p>'
});

$(function() {
    var $console = $('#console-div');
    var $container = $('#container');
    $('#btn').click(function() {
        var startTime = (new Date()).getTime();
        $console.append('start: ' + startTime + '<br/>');

        var w;

        for (var i = 0; i < 20; i++) {
            w = new MyWidget({
                model: {
                    a: i
                },
                parentNode: $container
            });
            w.render();
        }

        var endTime = (new Date()).getTime();
        $console.append('end: ' + endTime + '<br/>');
        $console.append('total cost: ' + (endTime - startTime) + '<br/>');
    });
});
````
