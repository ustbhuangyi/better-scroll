# better-scroll

## What is better-scroll ?

better-scroll is a plugin which is aimed at solving scrolling circumstances on the mobile side (perhaps supporting the PC side in the future). The core is inspired by the implementation of [iscroll](https://github.com/cubiq/iscroll), so the APIs of better-scroll are compatible with iscroll on the whole. What's more, better-scroll also extends some features and optimizes for performance  based on iscroll.

better-scroll is implemented with plain JavaScript, which measn it's dependency free. The size of compiled code is 46 kb, 26 kb after compressed, and only 7kb after gzip. better-scroll is a really lightweight JavaScript lib.

## Getting started

The best way to learn and use better-scroll is by viewing its demo code. We have put all the code in the  directory of [example](https://github.com/ustbhuangyi/better-scroll/tree/master/example). Considering that currently the most suitable front end MVVM framework for mobile development is [Vue](https://github.com/vuejs/vue), and better-scroll can be applied in conjunction with Vue very well, I rewrote the demo with Vue.

The most common application scenario of better-scroll is list scrolling. Let's see its structure of html:

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

In the code above, better-scroll is applied in the outer wrapper container, and the scrolling part is content element. Pay attention that better-scroll only handles the scroll of the first child element (content) of the container (wrapper), which means other elements will be ignored.

The simlest initialization code is as follow:

```javascript
import BScroll from 'better-scroll'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```

bettor-scroll provides a class whose first parameter is a plain DOM object when instantiated. Certainly, better-scroll inside would try to use querySelector to get the DOM object, so the initiazation code can also be like the following:

```javascript
import BScroll from 'better-scroll'
let scroll = new BScroll('.wrapper')
```



## The core of scrolling

Many developers have used better-scroll and the most problem they asked is:

> I have initiated better-scroll, but the content can't scroll.

The phenomenon is 'the content can't scroll' and we need to figure out the root cause of this. Before that, let's take a look at the browser's scrolling principle: everyone can see the browser's scroll bar. When the height of the page content exceeds the viewport height, the vertical scroll bar will appear; When the width of page content exceeds the viewport width, the horizontal bar will appear. That is to say, when the viewport can't display all the content, the browser would guide the user to scroll the screen with scroll bar to see the rest content.

The principle of  bett-scroll is the same. We can feel about this more obviously using a picture:

![布局](http://static.galileo.xiaojukeji.com/static/tms/shield/scroll-4.png)

The green part is the wrapper, also known as the father container, which has **fixed height**. The yellow part is the content, which is **the first child element** of the father container and whose height would grow with the size of its content. Then, when the height of the content doesn't exceed the height of the father container, the content would not scroll. Once exceeded, the content can be scrolled. That is the principle of better-scroll.

## The implementation of better-scroll in MVVM frameworks

I wrote a article [When better-scroll meets Vue](https://zhuanlan.zhihu.com/p/27407024) (in Chinese). I also hope that developers can contribute to share the experience of using better-scroll under other frameworks.

## Document

Visit [better-scroll document](https://ustbhuangyi.github.io/better-scroll/doc/)

## Demo

Visit [Demo](https://ustbhuangyi.github.io/better-scroll/)

Or scan QR Code below：

![QR Code](https://qr.api.cli.im/qr?data=https%253A%252F%252Fustbhuangyi.github.io%252Fbetter-scroll%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=0da6b5bf346079bafa07f6935dc996bd)
