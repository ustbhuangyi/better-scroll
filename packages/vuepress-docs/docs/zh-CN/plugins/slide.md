# slide

## 介绍

用于轮播和 swipe 效果。

## 安装

```bash
npm install @better-scroll/slide@next --save

// or

yarn add @better-scroll/slide@next
```

## 使用

你需要首先引入 slide 插件，并通过全局方法 `BScroll.use()` 使用

```js
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'

  BScroll.use(Slide)
```

上面步骤完成后，BScroll 的 `options` 中传入 slide 相关的配置后便可使用 slide。

```js
  new BScroll('.bs-wrap', {
    scrollX: true,
    scrollY: false,
    slide: {
      loop: true,
      threshold: 100
    },
    momentum: false,
    bounce: false,
    stopPropagation: true
  })
```

和 slide 相关的配置

- slide

  slide 相关的配置。需要设置 slide 的值为一个具体的对象，来开启 slide 效果。更多详细配置，请参考[slide 配置](./slide.html#配置)。

- scrollX

  当值为 true 时，设置 slide 的方向为 X 方向。

- scrollY

  当值为 true 时，设置 slide 的方向为 Y 方向。 **注意: scrollX 和 scrollY 不能同时设置为 true**

- momentum

  当使用 slide 时，这个值需要设置为 false，用来避免惯性动画带来的快速滚动时的闪烁问题。

- bounce

  当你设置了 slide.loop 为 true 时，bounce 值需要设置为 false，否则会在循环衔接的时候出现闪烁。

## 示例

- 水平方向下的轮播图

  <demo qrcode-url="slide/banner">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/banner.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/banner.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/banner.vue?style
    </template>
    <slide-banner slot="demo"></slide-banner>
  </demo>

- 全屏的轮播

  <demo qrcode-url="slide/fullpage">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/fullpage.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/fullpage.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/fullpage.vue?style
    </template>
    <slide-fullpage slot="demo"></slide-fullpage>
  </demo>

- 垂直方向 swipe

  <demo qrcode-url="slide/vertical">
    <template slot="code-template">
      <<< @/examples/vue/components/zoom/vertical.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/zoom/vertical.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/zoom/vertical.vue?style
    </template>
    <slide-vertical slot="demo"></slide-vertical>
  </demo>

  ::: tip
  注意：当设置 `useTransition = true`时，在 iphone 手上会出现闪烁。你需要像上面 demo 中的代码一样，给 swipe 的每一个元素额外增加下面两个样式：

  ```css
  transform: translate3d(0,0,0)
  backface-visibility: hidden
  ```
  :::

## 配置

### loop

是否可以循环。但是当只有一个元素的时候，该设置不生效。

- 类型：boolean
- 默认值：false

### easing

slider 切换时过度动画。

- 类型：object
- 默认值

```js
{
  style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  fn: function(t: number) {
    return 1 - --t * t * t * t
  }
}
```

- easing.style {string}: 用来设置过度动画的 `transition-timing-function` 值。
- easing.fn {function}: 当设置 `useTransition:false` 时，由 `easing.fn` 来确定动画曲线。

### listenFlick

当快速轻抚过 slider 区域时，会触发切换上一页/下一页。设置 listenFlick 为 false，可关闭该效果。

- 类型：boolean
- 默认值：true

### threshold

可滚动到下一个或上一个的阈值。

- 类型：number
- 默认值：0.1

:::tip
当滑动的范围小于该阈值时，不会触发切换到下一个或上一个。

可以设置为小数，如0.1，或者整数，如 100。当该值为小数时，threshold 被当成一个百分比，最终的阈值为 `slideItemWidth * threshold` 或者 `slideItemHeight * threshold`。当该值为整数时，则阈值就是 threshold 本身的值。
:::

### stepX

切换到下一个/上一个期间滚动过的像素距离。适用于 slider 方向为 X 轴，一般情况下你不需要设置该值，也不要轻易改变它的默认值。

- 类型：number
- 默认值：slideItemWidth


### stepY

切换到下一个/上一个期间滚动过的像素距离。适用于 slider 方向为 Y 轴，一般情况下你不需要设置该值，也不要轻易改变它的默认值。

- 类型：number
- 默认值：slideItemHeight

### disableSetWidth

默认情况下，在水平方向 slider 时，会根据 slider 元素的的宽度设置其包裹元素的宽度，以使得 slider 效果正常。当你要自己设置 slider 包裹元素的宽度时，需要设置该值为 true，否则你的设置可能会不生效。

- 类型：boolean
- 默认值：false

## 方法

### next(time, easing)

滚动到下一个页面

**参数**

|名称|类型|描述|
|----------|:-----:|:-----------|
|time|number|动画执行时间|
|easing|Object|easing 缓动函数，参考`slide.easing`配置|

**返回值**：无

### prev(time, easing)

滚动到上一个页面

**参数**

|名称|类型|描述|
|----------|:-----:|:-----------|
|time|number|动画执行时间|
|easing|Object|easing 缓动函数，参考`slide.easing`配置|

**返回值**：无

### goToPage(x, y, time, easing)

当我们做 slide 组件的时候，slide 通常会分成多个页面。调用此方法可以滚动到指定的页面。

**参数**

|名称|类型|描述|
|----------|:-----:|:-----------|
|x|number|x轴的页数|
|y|number|Y轴的页数|
|time|number|动画执行时间|
|easing|Object|easing 缓动函数，参考`slide.easing`配置|

**返回值**：无

### getCurrentPage()

获取当前页面的信息

**参数**: 无

**返回值**: Object。

|名称|类型|描述|
|----------|:-----:|:-----------|
|x|number|当前的偏移的 x 坐标值|
|y|number|当前的偏移的 y 坐标值|
|pageX|number| X 轴方向方向的页面 index 值(从 0 开始)|
|pageY|number| Y 轴方向方向的页面 index 值(从 0 开始)|
