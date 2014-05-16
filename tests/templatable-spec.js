var Widget = require('arale-widget');
var Templatable = require('../src/templatable');

var Handlebars = require('handlebars')['default'];
var expect = require('expect.js');
var $ = require('jquery');

describe('Templatable', function () {
  var globalVar = {};

  afterEach(function () {
    for (var v in globalVar) {
      globalVar[v].destroy();
    }
    globalVar = {};
  });

  var TemplatableWidget = Widget.extend({
    Implements: Templatable
  });

  it('normal usage', function () {

    var widget = globalVar.widget = new TemplatableWidget({
      template: '<div><h3>{{title}}</h3><p>{{content}}</p></div>',
      model: {
        title: 'Big Bang',
        content: 'It is very cool.'
      }
    });

    expect(widget.$('h3').text()).to.equal('Big Bang');
    expect(widget.$('p').text()).to.equal('It is very cool.');
  });

  it('Handlebars helpers', function () {

    var TestWidget = TemplatableWidget.extend({
      templateHelpers: {
        'link': function (obj) {
          return new Handlebars.SafeString('<a href="' + obj.href + '">' + obj.text + '</a>');
        }
      }
    });

    var widget = globalVar.widget = new TestWidget({
      template: '<p>{{link item}}</p>',
      model: {
        item: {
          href: 'http://google.com/',
          text: 'google'
        }
      }
    });

    expect(widget.element.html().toLowerCase()).to.equal('<a href="http://google.com/">google</a>');
  });

  it('renderPartial', function () {

    var t = globalVar.t = new TemplatableWidget({
      template: '<div id="t"><h3>{{title}}</h3><p>{{content}}</p></div>',
      model: {
        title: 'This is a title',
        content: 'This is content'
      }
    });

    t.render();
    expect($('#t')[0]).to.equal(t.element[0]);

    t.set('model', {
      title: 'xxx',
      content: 'yyy'
    });
    t.renderPartial('h3');
    expect(t.$('h3').html()).to.equal('xxx');
    expect(t.$('p').html()).to.equal('This is content');

    t.renderPartial();
    expect(t.$('h3').html()).to.equal('xxx');
    expect(t.$('p').html()).to.equal('yyy');
  });

  it('template expression in invalid place', function () {

    var t = globalVar.t = new TemplatableWidget({
      template: '<table id="t"><tbody><tr><td>&lt;!--{{xx}}--&gt;</td>{{#each items}}<td class="item-{{this}}">{{this}}</td>{{/each}}</tr></tbody></table>',
      model: {
        xx: 'xx',
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    });

    t.render();
    expect($('#t tbody td').length).to.equal(10);
    expect($('#t tbody td').eq(1).hasClass('item-1')).to.equal(true);
    expect($('#t tbody td').eq(0).html()).to.equal('&lt;!--xx--&gt;');

    t.set('model', {
      xx: 'xx',
      items: [1, 2, 3, 4, 5]
    });
    t.renderPartial('tbody tr');

    expect($('#t tbody td').length).to.equal(6);
    expect($('#t tbody td').eq(1).hasClass('item-1')).to.equal(true);
    expect($('#t tbody td').eq(0).html()).to.equal('&lt;!--xx--&gt;');
  });

  it('model.toJSON()', function () {

    var A = TemplatableWidget.extend({});

    var a = globalVar.a = new A({
      template: '<div>{{content}}</div>',
      model: {
        toJSON: function () {
          return {
            'content': 'xx'
          };
        }
      }
    });

    a.render();
    expect(a.element.html()).to.equal('xx');
  });

  it('#10: src expression in template string', function () {

    var t = globalVar.t = new TemplatableWidget({
      template: '<div id="t10"><h3>{{title}}</h3><div class="content">{{content}}<img src="{{src}}"></div></div>',
      model: {
        title: 'This is a title',
        content: 'This is content',
        src: "https://i.alipayobjects.com/e/201207/36PCiRAolN.jpg"
      }
    });

    t.render();

    // 这个测试要看下 Network 面板，看是否有无效的图片请求
    t.set('model', {
      content: 'content 2'
    });
    t.renderPartial('div.content');

    expect(t.$('div.content').html().indexOf('content 2') === 0).to.equal(true);
    expect(t.$('div.content').html().toLowerCase().indexOf('img') > 0).to.equal(true);

  });

  it('#7: render twice', function () {

    var n = 0;

    var WidgetA = TemplatableWidget.extend({
      attrs: {
        content: '1',
        template: '<div id="t7"><h3>{{title}}</h3><div class="content">{{content}}</div></div>',

        model: {
          title: 'This is a title',
          content: 'This is content'
        }
      },

      _onRenderContent: function (val) {
        n++;
        this.set('content', val);
        this.renderPartial('div.content');
      }
    });

    var t = globalVar.t = new WidgetA({
      content: '2'
    });

    t.render();
    expect(n).to.equal(1);

    t.set('content', '2');
    expect(n).to.equal(1);

    t.set('content', '3');
    expect(n).to.equal(2);

  });

  it('template support id selector', function () {
    var dom = $('<div id="tpl"><div><h3>{{title}}</h3><p>{{content}}</p></div></div>').appendTo(document.body);

    var widget = globalVar.widget = new TemplatableWidget({
      template: '#tpl',
      model: {
        title: 'Big Bang',
        content: 'It is very cool.'
      }
    });

    expect(widget.$('h3').text()).to.equal('Big Bang');
    expect(widget.$('p').text()).to.equal('It is very cool.');
    dom.remove();
  });

  it('selector not exist in renderPartial', function () {
    var t = globalVar.t = new TemplatableWidget({
      template: '<div><h3>{{title}}</h3><div class="content">{{content}}<img src="{{src}}"></div></div>',
      model: {
        title: 'This is a title',
        content: 'This is content',
        src: "https://i.alipayobjects.com/e/201207/36PCiRAolN.jpg"
      }
    }).render();

    expect(function () {
      t.renderPartial('.notExist');
    }).to.throwException('Invalid template selector: .notExist');
  });

  it('renderAll if renderPartial empty', function () {
    var t = globalVar.t = new TemplatableWidget({
      template: '<div><h3>{{title}}</h3><p></p></div>',
      model: {
        title: 'This is a title'
      }
    }).render();

    t.set('model', {
      title: 't'
    });
    t.renderPartial('p');
    expect(t.element.find('h3').html()).to.be('t');
  });

  it('#3: renderPartial when template is compiled', function () {
    var template = Handlebars.compile('<div class="container"><h3>{{title}}</h3><p>{{content}}</p></div>');
    var t = globalVar.t = new TemplatableWidget({
      template: template,
      model: {
        title: 'this is a title',
        content: 'a'
      }
    }).render();

    t.set('model', {
      title: 'b',
      content: 'c'
    });
    t.renderPartial('p');
    expect(t.element.html().replace(/\r\n/, '').toLowerCase()).to.be('<h3>this is a title</h3><p>c</p>');

    t.renderPartial();
    expect(t.element.html().replace(/\r\n/, '').toLowerCase()).to.be('<h3>b</h3><p>c</p>');
  });

  it('support helper', function () {
    var WidgetA = TemplatableWidget.extend({
      templateHelpers: {
        testHelper: function () {
          return 'helper';
        }
      },
      attrs: {
        model: {}
      }
    });

    var t = globalVar.t = new WidgetA({
      template: '<div>{{testHelper}}</div>'
    }).render();
    expect(t.element.html()).to.be('helper');
  });

  it('support helper runtime', function () {
    var WidgetA = TemplatableWidget.extend({
      templateHelpers: {
        testHelper: function () {
          return 'helper';
        }
      },
      attrs: {
        model: {}
      }
    });

    var template = Handlebars.compile('<div>{{testHelper}}</div>');
    var t = globalVar.t = new WidgetA({
      template: template
    }).render();
    expect(t.element.html()).to.be('helper');
  });

  it('support partial', function () {
    var WidgetA = TemplatableWidget.extend({
      templatePartials: {
        testPartials: '{{title}}'
      }
    });

    var t = globalVar.t = new WidgetA({
      template: '<div>{{> testPartials}}</div>',
      model: {
        title: 'title'
      }
    }).render();
    expect(t.element.html()).to.be('title');
  });

  it('support partial runtime', function () {
    var WidgetA = TemplatableWidget.extend({
      templatePartials: {
        testPartials: '{{title}}'
      }
    });

    var template = require('./a');
    var t = globalVar.t = new WidgetA({
      template: template,
      model: {
        title: 'title'
      }
    }).render();
    expect(t.element.html()).to.be('title');
  });
});
