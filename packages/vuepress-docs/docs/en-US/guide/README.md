# Introduction

## What is BetterScroll ?

BetterScroll is a plugin which is aimed at solving scrolling circumstances on the mobile side (PC supported already). The core is inspired by the implementation of [iscroll](https://github.com/cubiq/iscroll), so the APIs of BetterScroll are compatible with iscroll on the whole. What's more, BetterScroll also extends some features and optimizes for performance based on iscroll.

BetterScroll is implemented with plain JavaScript, which means it's dependency free.

## Demo

<img :src="$withBase('/assets/images/qrcode.png')" alt="demo">

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

In the code above, BetterScroll is applied to the outer `wrapper` container, and the scrolling part is `content` element. Pay attention that BetterScroll only handles the scroll of the first child element (content) of the container (`wrapper`), which means other elements will be ignored.

The simplest initialization code is as follow:

```javascript
import BScroll from '@better-scroll/core'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```

BetterScroll provides a class whose first parameter is a plain DOM object when instantiated. Certainly, BetterScroll inside would try to use querySelector to get the DOM object.

:::warning
In BetterScroll 2.X, we split the 1.X-coupled feature into the plugin to achieve on-demand loading and reduce the volume of the package. Therefore, `@better-scroll/core` only provides the most core scrolling capabilities. If you want to implement the **pull-up refresh**, **pull-down load** function, you need to use the corresponding [plugin] (/en-US/plugins).
:::

## The principle of scrolling

Many developers have used BetterScroll, but the most common problem they have met is:

> I have initiated BetterScroll, but the content can't scroll.

The phenomenon is 'the content can't scroll' and we need to figure out the root cause. Before that, let's take a look at the browser's scrolling principle: everyone can see the browser's scroll bar. When the height of the page content exceeds the viewport height, the vertical scroll bar will appear; When the width of page content exceeds the viewport width, the horizontal bar will appear. That is to say, when the viewport can't display all the content, the browser would guide the user to scroll the screen with scroll bar to see the rest of content.

The principle of BetterScroll is samed as the browser. We can feel about this more obviously using a picture:

<img :src="$withBase('/assets/images/schematic.png')" alt="schematic">

The green part is the wrapper, also known as the parent container, which has **fixed height**. The yellow part is the content, which is **the first child element** of the parent container and whose height would grow with the size of its content. Then, when the height of the content doesn't exceed the height of the parent container, the content would not scroll. Once exceeded, the content can be scrolled. That is the principle of BetterScroll.

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
