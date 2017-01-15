# better-scroll
[![npm](https://img.shields.io/npm/v/better-scroll.svg?style=flat-square)](https://www.npmjs.com/package/better-scroll)

inspired by iscroll, and it has a better scroll perfermance

## 立即使用

```HTML
<body>
  <div id="wrapper">
    <ul>
	   <li>...</li>
	   <li>...</li>
	   ...
    </ul>
  </div>
<script type="text/javascript" src="better-scroll.js"></script>
<script type="text/javascript">
  new BScroll(document.getElementById('wrapper'));
</script>
</body>
```

搞定 !

## 通过npm引入

安装better-scroll

```shell
npm install better-scroll --save-dev
```
引入better-scroll

```javascript
import BScroll from 'better-scroll'
```

>如果不支持import, 请使用

```javascript
var BScroll = require('better-scroll')
```

## DEMO
better-scroll的源码是基于webpack构建的

首先，clone项目源码

```shell
git clone https://github.com/ustbhuangyi/better-scroll.git
```

安装依赖

```shell
cd better-scroll
npm install
```

测试demo页

```shell
npm run dev
```

打开浏览器访问如下地址, 查看效果

> localhost:9090

## Options 参数

Example:

```javascript
let scroll = new BScroll(document.getElementById('wrapper'), {
  startX: 0,
  startY: 0
})
```

Options List:

- startX: `0` 开始的X轴位置
- startY: `0` 开始的Y轴位置
- scrollY: `true` 滚动方向
- click: `true` 是否启用click事件
- directionLockThreshold: `5`
- momentum: `true` 是否开启动量动画，关闭可以提升效率
- bounce: `true` 是否启用弹力动画效果，关掉可以加速
- selectedIndex: `0`
- rotate: `25`
- wheel: `false` 是否监听鼠标滚轮事件
- snap: `false` 自动分割容器，用于制作走马灯效果等
- snapLoop: `false`
- snapThreshold: `0.1`
- swipeTime: `2500`
- bounceTime: `700` 弹力动画持续的毫秒数
- adjustTime: `400`
- swipeBounceTime: `1200`
- deceleration: `0.001` 滚动动量减速越大越快，建议不大于0.01
- momentumLimitTime: `300`
- momentumLimitDistance: `15`
- resizePolling: `60` 重新调整窗口大小时，重新计算better-scroll的时间间隔
- preventDefault: `true` 是否阻止默认事件
- preventDefaultException: `{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }` 阻止默认事件
- HWCompositing: `true` 是否启用硬件加速
- useTransition: `true` 是否使用CSS3的Transition属性，否则使用-requestAnimationFram代替
- useTransform: `true` 是否使用CSS3的Transform属性
- probeType: `1` 滚动的时候会派发scroll事件，会截流。`2`滚动的时候实时派发scroll事件，不会截流。 `3`除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件

## Events 事件

Example:

```javascript
let scroll = new BScroll(document.getElementById('wrapper'),{
   probeType: 3
})

scroll.on('scroll', (pos) => {
  console.log(pos.x + '~' + posx.y)
  ...
})
```

Events 列表

- beforeScrollStart 滚动开始之前触发
- scrollStart 滚动开始时触发
- scroll 滚动时触发
- scrollCancel 取消滚动时触发
- scrollEnd 滚动结束时触发
- flick 
- refresh
- destroy 销毁better-scroll实例时触发


## 派发滚动

```javascript
let scroll = new BScroll(document.getElementById('wrapper'))
scroll.scrollTo(0, 500)
...
```

第一个参数为X轴，第二个参数为Y轴
