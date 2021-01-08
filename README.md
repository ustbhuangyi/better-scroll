# better-scroll

<img src="https://dpubstatic.udache.com/static/dpubimg/t_L6vAgQ-E/logo.svg">

[![npm version](https://img.shields.io/npm/v/better-scroll.svg)](https://www.npmjs.com/package/better-scroll) [![downloads](https://img.shields.io/npm/dm/better-scroll.svg)](https://www.npmjs.com/package/better-scroll) [![Build Status](https://travis-ci.org/ustbhuangyi/better-scroll.svg?branch=master)](https://travis-ci.org/ustbhuangyi/better-scroll)  [![Package Quality](http://npm.packagequality.com/shield/better-scroll.svg)](http://packagequality.com/#?package=better-scroll) [![codecov.io](http://codecov.io/github/ustbhuangyi/better-scroll/coverage.svg?branch=master)](http://codecov.io/github/ustbhuangyi/better-scroll)

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/README_zh-CN.md)

[1.x Docs](https://better-scroll.github.io/docs-v1/)

[2.x Docs](https://better-scroll.github.io/docs/en-US/)

[2.x Demo](https://better-scroll.github.io/examples/)

> **Note**: `1.x` is not maintained. please migrate your version as soon as possible

# Install

```bash
npm install better-scroll -S # install 2.x，with full-featured plugin.

npm install @better-scroll/core # only CoreScroll
```

```js
import BetterScroll from 'better-scroll'

let bs = new BetterScroll('.wrapper', {
  movable: true,
  zoom: true
})

import BScroll from '@better-scroll/core'

let bs = new BScroll('.wrapper', {})
```

# CDN

BetterScroll with full-featured plugin.

```html
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.js"></script>

<!-- minify -->
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.min.js"></script>
```

```js
let wrapper = document.getElementById("wrapper")
let bs = BetterScroll.createBScroll(wrapper, {})
```


Only CoreScroll

```html
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.js"></script>

<!-- minify -->
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.min.js"></script>
```

```js
let wrapper = document.getElementById("wrapper")
let bs = new BScroll(wrapper, {})
```

## Wechat

<img src="" />

## What is BetterScroll ?

BetterScroll is a plugin which is aimed at solving scrolling circumstances on the mobile side (PC supported already). The core is inspired by the implementation of [iscroll](https://github.com/cubiq/iscroll), so the APIs of BetterScroll are compatible with iscroll on the whole. What's more, BetterScroll also extends some features and optimizes for performance based on iscroll.

BetterScroll is implemented with plain JavaScript, which means it's dependency free.

## Getting started

The most common application scenario of BetterScroll is list scrolling. Let's see its HTML:

```html
<div class="wrapper">
  <ul class="content">
    <li>...</li>
    <li>...</li>
    ...
  </ul>
  <!-- you can put some other DOMs here, it won't affect the scrolling
</div>
```

In the code above, BetterScroll is applied to the outer `wrapper` container, and the scrolling part is `content` element. Pay attention that BetterScroll handles the scroll of the first child element (content) of the container (`wrapper`) by default, which means other elements will be ignored. However, for BetterScroll v2.0.4, content can be specified through the `specifiedIndexAsContent` option. Please refer to the docs for details.

The simplest initialization code is as follow:

```javascript
import BScroll from '@better-scroll/core'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```

BetterScroll provides a class whose first parameter is a plain DOM object when instantiated. Certainly, BetterScroll inside would try to use querySelector to get the DOM object.

## The principle of scrolling

Many developers have used BetterScroll, but the most common problem they have met is:

> I have initiated BetterScroll, but the content can't scroll.

The phenomenon is 'the content can't scroll' and we need to figure out the root cause. Before that, let's take a look at the browser's scrolling principle: everyone can see the browser's scroll bar. When the height of the page content exceeds the viewport height, the vertical scroll bar will appear; When the width of page content exceeds the viewport width, the horizontal bar will appear. That is to say, when the viewport can't display all the content, the browser would guide the user to scroll the screen with scroll bar to see the rest of content.

The principle of BetterScroll is samed as the browser. We can feel about this more obviously using a picture:

![布局](https://raw.githubusercontent.com/ustbhuangyi/better-scroll/master/packages/vuepress-docs/docs/.vuepress/public/assets/images/schematic.png)

The green part is the wrapper, also known as the parent container, which has **fixed height**. The yellow part is the content, which is **the first child element** of the parent container and whose height would grow with the size of its content. Then, when the height of the content doesn't exceed the height of the parent container, the content would not scroll. Once exceeded, the content can be scrolled. That is the principle of BetterScroll.

## Plugins

Enhance the ability of BetterScroll core scroll through plugins, such as

```js
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'

let bs = new BScroll('.wrapper', {
  pullUpLoad: true
})
```

Please see for details, [Plugins](https://better-scroll.github.io/docs/en-US/plugins/).

## Using BetterScroll with MVVM frameworks

I wrote an article [When BetterScroll meets Vue](https://zhuanlan.zhihu.com/p/27407024) (in Chinese). I also hope that developers can contribute to share the experience of using BetterScroll with other frameworks.

A fantastic mobile ui lib implement by Vue: [cube-ui](https://github.com/didi/cube-ui/)

## Using BetterScroll in the real project

If you want to learn how to use BetterScroll in the real project，you can learn my two practical courses(in Chinese)。

[High imitating starvation takeout practical course base on Vue.js](https://coding.imooc.com/class/74.html)

[Project demo address](http://ustbhuangyi.com/sell/)

![QR Code](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fsell%252F%2523%252Fgoods&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=686203a49c4613080b5b3004323ff977)

[Music App advanced practical course base on Vue.js](http://coding.imooc.com/class/107.html)

[Project demo address](http://ustbhuangyi.com/music/)

![QR Code](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fmusic%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=731bbcc2b490454d2cc604f98539952c)
