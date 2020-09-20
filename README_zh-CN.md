# better-scroll

[![npm version](https://img.shields.io/npm/v/better-scroll.svg)](https://www.npmjs.com/package/better-scroll) [![downloads](https://img.shields.io/npm/dm/better-scroll.svg)](https://www.npmjs.com/package/better-scroll) [![Build Status](https://travis-ci.org/ustbhuangyi/better-scroll.svg?branch=master)](https://travis-ci.org/ustbhuangyi/better-scroll)  [![Package Quality](http://npm.packagequality.com/shield/better-scroll.svg)](http://packagequality.com/#?package=better-scroll)  [![codecov.io](http://codecov.io/github/ustbhuangyi/better-scroll/coverage.svg?branch=master)](http://codecov.io/github/ustbhuangyi/better-scroll)

[1.x Docs](https://better-scroll.github.io/docs-v1/)

[2.x Docs](https://better-scroll.github.io/docs/zh-CN/)

> **注意**：1.x 的代码已经不维护，请尽早升级版本。

# 安装

```bash
npm install better-scroll -S  # 安装带有所有插件的 BetterScroll

npm install @better-scroll/core # 核心滚动，大部分情况可能只需要一个简单的滚动
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

带有所有插件的 BetterScroll

```js
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.js"></script>

// minify
<script src="https://unpkg.com/better-scroll@latest/dist/better-scroll.min.js"></script>

let wrapper = document.getElementById("wrapper")
let bs = BetterScroll.createBScroll(wrapper, {})
```

不带有任何插件的 CoreScroll

```js
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.js"></script>

// minify
<script src="https://unpkg.com/@better-scroll/core@latest/dist/core.min.js"></script>

let wrapper = document.getElementById("wrapper")
let bs = new BScroll(wrapper, {})
```

# BetterScroll 是什么

BetterScroll 是一款重点解决移动端（已支持 PC）各种滚动场景需求的插件。它的核心是借鉴的 [iscroll](https://github.com/cubiq/iscroll) 的实现，它的 API 设计基本兼容 iscroll，在 iscroll 的基础上又扩展了一些 feature 以及做了一些性能优化。

BetterScroll 是使用纯 JavaScript 实现的，这意味着它是无依赖的。

## 起步

BetterScroll 最常见的应用场景是列表滚动，我们来看一下它的 html 结构。

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
上面的代码中 BetterScroll 是作用在外层 wrapper 容器上的，滚动的部分是 content 元素。这里要注意的是，BetterScroll 默认处理容器（wrapper）的第一个子元素（content）的滚动，其它的元素都会被忽略。不过对于 BetterScroll v2.0.4 版本，可以通过 specifiedIndexAsContent 配置项来指定 content，详细的请参考文档。

最简单的初始化代码如下：

``` js
import BScroll from '@better-scroll/core'
let wrapper = document.querySelector('.wrapper')
let scroll = new BScroll(wrapper)
```
BetterScroll 提供了一个类，实例化的第一个参数是一个原生的 DOM 对象。当然，如果传递的是一个字符串，BetterScroll 内部会尝试调用 querySelector 去获取这个 DOM 对象。

## 滚动原理

很多人已经用过 BetterScroll，我收到反馈最多的问题是：

> BetterScroll 初始化了， 但是没法滚动。

不能滚动是现象，我们得搞清楚这其中的根本原因。在这之前，我们先来看一下浏览器的滚动原理：
浏览器的滚动条大家都会遇到，当页面内容的高度超过视口高度的时候，会出现纵向滚动条；当页面内容的宽度超过视口宽度的时候，会出现横向滚动条。也就是当我们的视口展示不下内容的时候，会通过滚动条的方式让用户滚动屏幕看到剩余的内容。

BetterScroll 也是一样的原理，我们可以用一张图更直观的感受一下：

![布局](https://raw.githubusercontent.com/ustbhuangyi/better-scroll/master/packages/vuepress-docs/docs/.vuepress/public/assets/images/schematic.png)

绿色部分为 wrapper，也就是父容器，它会有**固定的高度**。黄色部分为 content，它是父容器的**第一个子元素**，它的高度会随着内容的大小而撑高。那么，当 content 的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这就是 BetterScroll 的滚动原理。

## 插件

通过插件，增强 BetterScroll core scroll 的能力，比如

```js
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'

let bs = new BScroll('.wrapper', {
  pullUpLoad: true
})
```

详细请看[插件文档](https://better-scroll.github.io/docs/zh-CN/plugins/)

## BetterScroll 在 MVVM 框架的应用

我之前写过一篇[当 BetterScroll 遇见 Vue](https://zhuanlan.zhihu.com/p/27407024)，也希望大家投稿，分享一下 BetterScroll 在其它框架下的使用心得。

一款超赞的基于 Vue 实现的组件库 [cube-ui](https://github.com/didi/cube-ui/)。

## BetterScroll 在实战项目中的运用

如果你想学习 BetterScroll 在实战项目中的运用，也可以去学习我的 2 门实战课程。

[Vue.js 高仿外卖饿了么实战课程](https://coding.imooc.com/class/74.html)

[项目演示地址](http://ustbhuangyi.com/sell/)

![二维码](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fsell%252F%2523%252Fgoods&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=686203a49c4613080b5b3004323ff977)

[Vue.js 音乐 App 高级实战课程](http://coding.imooc.com/class/107.html)

[项目演示地址](http://ustbhuangyi.com/music/)

![二维码](https://qr.api.cli.im/qr?data=http%253A%252F%252Fustbhuangyi.com%252Fmusic%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=731bbcc2b490454d2cc604f98539952c)
