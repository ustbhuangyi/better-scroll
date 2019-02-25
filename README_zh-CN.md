# better-scroll

[![npm](https://img.shields.io/npm/v/better-scroll.svg?style=flat-square)](https://www.npmjs.com/package/better-scroll) [![Build Status](https://travis-ci.org/ustbhuangyi/better-scroll.svg?branch=master)](https://travis-ci.org/ustbhuangyi/better-scroll) [![downloads](https://img.shields.io/npm/dm/better-scroll.svg)](https://www.npmjs.com/package/better-scroll)

## better-scroll 是什么

better-scroll 是一款重点解决移动端（现已支持 PC 端）各种滚动场景需求的插件。它的核心是借鉴的 [iscroll](https://github.com/cubiq/iscroll) 的实现，它的 API 设计基本兼容 iscroll，在 iscroll 的基础上又扩展了一些 feature 以及做了一些性能优化。

better-scroll 是基于原生 JS 实现的，不依赖任何框架。它编译后的代码大小是 63kb，压缩后是 35kb，gzip 后仅有 9kb，是一款非常轻量的 JS lib。

## 起步

学习使用 better-scroll 最好的方式是看它的 demo 代码，我们把代码都放在了 [example](https://github.com/ustbhuangyi/better-scroll/tree/master/example) 目录。由于目前最适合移动端开发的前端 mvvm 框架是 [Vue](https://github.com/vuejs/vue)，并且 better-scroll 可以很好的和 Vue 配合使用的，所以 demo 我都用 Vue 进行了重写。

better-scroll 最常见的应用场景是列表滚动，我们来看一下它的 html 结构
```html
<div class="wrapper">
  <ul class="content">
    <li>...</li>
    <li>...</li>
    ...
  </ul>
  <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
</div>
```
上面的代码中 better-scroll 是作用在外层 wrapper 容器上的，滚动的部分是 content 元素。这里要注意的是，better-scroll 只处理容器（wrapper）的第一个子元素（content）的滚动，其它的元素都会被忽略。

最简单的初始化代码如下：

``` js
import BScroll from 'better-scroll'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```
better-scroll 提供了一个类，实例化的第一个参数是一个原生的 DOM 对象。当然，如果传递的是一个字符串，better-scroll 内部会尝试调用 querySelector 去获取这个 DOM 对象，所以初始化代码也可以是这样：

``` js
import BScroll from 'better-scroll'
let scroll = new BScroll('.wrapper')
```

## 滚动原理

很多人已经用过 better-scroll，我收到反馈最多的问题是：

> better-scroll 初始化了， 但是没法滚动。

不能滚动是现象，我们得搞清楚这其中的根本原因。在这之前，我们先来看一下浏览器的滚动原理：
浏览器的滚动条大家都会遇到，当页面内容的高度超过视口高度的时候，会出现纵向滚动条；当页面内容的宽度超过视口宽度的时候，会出现横向滚动条。也就是当我们的视口展示不下内容的时候，会通过滚动条的方式让用户滚动屏幕看到剩余的内容。

better-scroll 也是一样的原理，我们可以用一张图更直观的感受一下：

![布局](./static/image/layout-description-image.png)

绿色部分为 wrapper，也就是父容器，它会有**固定的高度**。黄色部分为 content，它是父容器的**第一个子元素**，它的高度会随着内容的大小而撑高。那么，当 content 的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这就是 better-scroll 的滚动原理。

## better-scroll 在 MVVM 框架的应用

我之前写过一篇[当 better-scroll 遇见 Vue](https://zhuanlan.zhihu.com/p/27407024)，也希望大家投稿，分享一下 better-scroll 在其它框架下的使用心得。

一款超赞的基于 Vue 实现的组件库 [cube-ui](https://github.com/didi/cube-ui/)。

## better-scroll 在实战项目中的运用

如果你想学习 better-scroll 在实战项目中的运用，也可以去学习我的 2 门实战课程。

[Vue.js 高仿外卖饿了么实战课程](https://coding.imooc.com/class/74.html)

[项目演示地址](http://ustbhuangyi.com/sell/)

![二维码](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fsell%252F%2523%252Fgoods&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=686203a49c4613080b5b3004323ff977)

[Vue.js 音乐 App 高级实战课程](http://coding.imooc.com/class/107.html)

[项目演示地址](http://ustbhuangyi.com/music/)

![二维码](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fmusic%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=731bbcc2b490454d2cc604f98539952c)

## 文档

访问 [better-scroll document](https://ustbhuangyi.github.io/better-scroll/doc/)

## 类型声明文件(since 1.13.0+)
```
npm i @types/better-scroll -D
```
目前由[stoneChen](https://github.com/stoneChen)(感谢[taoqf](https://github.com/taoqf) 提供初始类型代码)维护。

## 交流群（一、二群已满）

<img src="./static/image/bs-qq3.jpg" width=280 height=384>

## Demo

访问 [Demo](https://ustbhuangyi.github.io/better-scroll/)

或者扫描下方二维码：

![QR Code](https://qr.api.cli.im/qr?data=https%253A%252F%252Fustbhuangyi.github.io%252Fbetter-scroll%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=0da6b5bf346079bafa07f6935dc996bd)

## Changelog

每次改动的详情参考[发版日志](https://github.com/ustbhuangyi/better-scroll/releases).
