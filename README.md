# better-scroll

[![npm](https://img.shields.io/npm/v/better-scroll.svg?style=flat-square)](https://www.npmjs.com/package/better-scroll) [![Build Status](https://travis-ci.org/ustbhuangyi/better-scroll.svg?branch=master)](https://travis-ci.org/ustbhuangyi/better-scroll) [![codecov.io](http://codecov.io/github/ustbhuangyi/better-scroll/coverage.svg?branch=master)](http://codecov.io/github/ustbhuangyi/better-scroll)

## What is better-scroll ?

better-scroll is a plugin which is aimed at solving scrolling circumstances on the mobile side (perhaps supporting the PC side in the future). The core is inspired by the implementation of [iscroll](https://github.com/cubiq/iscroll), so the APIs of better-scroll are compatible with iscroll on the whole. What's more, better-scroll also extends some features and optimizes for performance based on iscroll.

better-scroll is implemented with plain JavaScript, which means it's dependency free. The size of compiled code is 46 KB, 26 KB after compressed, and only 7KB after gzip. better-scroll is a really lightweight JavaScript lib.

## Getting started

The best way to learn and use better-scroll is by viewing its demo. We have put all the code in [example](https://github.com/ustbhuangyi/better-scroll/tree/master/example) directory. Considering that one of the most suitable JavaScript MVVM framework for mobile development currently is [Vue](https://github.com/vuejs/vue), and better-scroll can be applied in conjunction with Vue very well, so I rewrote the demo with Vue.

The most common application scenario of better-scroll is list scrolling. Let's see its HTML:

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

In the code above, better-scroll is applied to the outer `wrapper` container, and the scrolling part is `content` element. Pay attention that better-scroll only handles the scroll of the first child element (content) of the container (`wrapper`), which means other elements will be ignored.

The simplest initialization code is as follow:

```javascript
import BScroll from 'better-scroll'
const wrapper = document.querySelector('.wrapper')
const scroll = new BScroll(wrapper)
```

bettor-scroll provides a class whose first parameter is a plain DOM object when instantiated. Certainly, better-scroll inside would try to use querySelector to get the DOM object, so the initiazation code can also be like the following:

```javascript
import BScroll from 'better-scroll'
const scroll = new BScroll('.wrapper')
```

## The core of scrolling

Many developers have used better-scroll, but the most common problem they have met is:

> I have initiated better-scroll, but the content can't scroll.

The phenomenon is 'the content can't scroll' and we need to figure out the root cause. Before that, let's take a look at the browser's scrolling principle: everyone can see the browser's scroll bar. When the height of the page content exceeds the viewport height, the vertical scroll bar will appear; When the width of page content exceeds the viewport width, the horizontal bar will appear. That is to say, when the viewport can't display all the content, the browser would guide the user to scroll the screen with scroll bar to see the rest of content.

The principle of bett-scroll is samed as the browser. We can feel about this more obviously using a picture:

![布局](http://static.galileo.xiaojukeji.com/static/tms/shield/scroll-4.png)

The green part is the wrapper, also known as the parent container, which has **fixed height**. The yellow part is the content, which is **the first child element** of the parent container and whose height would grow with the size of its content. Then, when the height of the content doesn't exceed the height of the parent container, the content would not scroll. Once exceeded, the content can be scrolled. That is the principle of better-scroll.

## Using better-scroll with MVVM frameworks

I wrote an article [When better-scroll meets Vue](https://zhuanlan.zhihu.com/p/27407024) (in Chinese). I also hope that developers can contribute to share the experience of using better-scroll with other frameworks.

## Document

Visit [better-scroll document](https://ustbhuangyi.github.io/better-scroll/doc/)

## Demo

Visit [Demo](https://ustbhuangyi.github.io/better-scroll/)

Or scan QR Code：

![QR Code](https://qr.api.cli.im/qr?data=https%253A%252F%252Fustbhuangyi.github.io%252Fbetter-scroll%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=0da6b5bf346079bafa07f6935dc996bd)
