# Templatable

---

[![Build Status](https://travis-ci.org/aralejs/templatable.png?branch=master)](https://travis-ci.org/aralejs/templatable) [![Coverage Status](https://coveralls.io/repos/aralejs/templatable/badge.png?branch=master)](https://coveralls.io/r/aralejs/templatable)

处理组件的模板渲染，混入到 [Widget](http://aralejs.org/widget/) 中使用。

---

## 使用说明

可混入的功能类，提供 Handlebars 模板支持。

```js
var Templatable = require('templatable');

var MyWidget = Widget.extend({
    Implements: Templatable
});

var myWidget = new MyWidget({
    template: '<div><h3>{{title}}</h3><ol>{{#each list}}<li>{{item}}</li>{{/each}}</div>',
    model: {
        'title': '标题',
        'list': [
            { 'item': '文章一' },
            { 'item': '文章二' }
        ]
    },
    parentNode: '#demo'
});

myWidget.render();
```

Templatable 在渲染的时候会读取 `this.get('model')` 和 `this.get('template')`，这两个是实例化的时候传入的，最终生成 `this.element`。

`this.get('template')` 支持多种格式：

1. html 的字符串

2. id 选择器，最常用而且判断简单

3. 函数，通过 handlerbars 编译过的模板

### renderPartial `.renderPartial(selector)`

局部渲染，根据传入的 `selector` 参数，刷新匹配的区域。

默认无需覆盖。需要覆盖时，请使用 `return this` 来保持该方法的链式约定。

```js
this.set('model', {
  title: '新标题'
});
this.renderPartial('h3');
```

### templateHelpers

可以使用 handlebars 的 helper，由于 handlerbars 是全局注册，所以每次编译都会重新注册。

看[示例二](http://aralejs.org/templatable/examples/)

### templatePartials

可以使用 handlebars 的 partials。

