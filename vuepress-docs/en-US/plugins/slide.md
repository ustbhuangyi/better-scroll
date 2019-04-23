# slide

## Introduction

This plugin is used for slider or swipe.

## Usage

To hava slider or swipe effect, you need to import the slide plugin and use it with `BScroll.use()`.

```js
import BScroll from 'BScroll'
import Slide from 'Slide'

BScroll.use(Slide)
```

You can get the slider effect after setting some configurations which are required by slide plugin.

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

The following are the configuration related to the slide:

- slide
  It needs a Object value to enable slide functionality. This option is also be used to set the slide feature. Refer to [slide options](./slide.html#options)] for more details.

- scrollX
  When setted to true, horizontal slider would be enabled.

- scrollY
  When setted to true, vertical slider would be enabled. **Note: scrollX and scrollY cannot be set to true at the same time**

- momentum
  This value needs to be set to false to prevent the flicker when users quickly flick on screen.

- bounce
  Setting this to false if you have enabled the loop feature with `slide.loop = true`. Bounce feature will cause flicker when the slider switch from the last page to the fist page or from the first page to the last page.

## 示例

- horizontal slider
  
<demo>
  <template slot="code-template">
    <<< @/example/vue/demo/slide/banner.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/demo/slide/banner.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/demo/slide/banner.vue?style
  </template>
  <slide-banner slot="demo"></slide-banner>
</demo>

- full page slider

<demo>
  <template slot="code-template">
    <<< @/example/vue/demo/slide/fullpage.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/demo/slide/fullpage.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/demo/slide/fullpage.vue?style
  </template>
  <slide-fullpage slot="demo"></slide-fullpage>
</demo>

- vertical slider
  
<demo>
  <template slot="code-template">
    <<< @/example/vue/demo/zoom/vertical.vue?template
  </template>
  <template slot="code-script">
    <<< @/example/vue/demo/zoom/vertical.vue?script
  </template>
  <template slot="code-style">
    <<< @/example/vue/demo/zoom/vertical.vue?style
  </template>
  <slide-vertical slot="demo"></slide-vertical>
</demo>

::: tip
Note: The screen will be flicker when the slider switches from one page to another in the case of `useTransition = true`. To fix this, you should add two style for every slider item like the code showed in vertical slider demo.

```css
transform: translate3d(0,0,0)
backface-visibility: hidden
```
:::

## options

### loop
set to true to support slide loop. 
:::tip
It won't work when there is only one slide item.
:::
- Type: boolean
- Default: false

### easing
The scroll easing function for switching.
- Type: object
- Default
```js
{
  style: 'cubic-bezier(0.165, 0.84, 0.44, 1)', 
  fn: function(t: number) {
    return 1 - --t * t * t * t
  }
}
```
- easing.style {string}: The css value of `transition-timing-function` when the slider switches.
- easing.fn {function}: When `useTransitionf` is set to false, the animation curve is determined by `easing.fn`.

### listenFlick

The slider will switch from one page to another when a user flickes it. This can be turned off by setting listenFlick to false.
- Type: boolean
- Default: true

### threshold

The threshold of going to the next page.
:::tip
When the scrolling distance is less than the threshold, the switching action won't be triggered. 
当滑动的范围小于该阈值时，不会触发切换到下一个或上一个。可以设置为小数，如0.1，或者整数，如 100。

It's value can be a decimal, such as 0.1, or an integer such as 100. The difference between decimal and integer is that decimal is treated as a percentage of widh or height of slide item and integer is a threshold value.
:::
- Type: number
- Default: 0.1

### stepX
Horizonal pixel distance scrolled during the switch to the next page in x-axis direction. In general, you don't need to set this value. You should be careful when change it.
- Type: number
- Default: slideItemWidth


### stepY
Similar to stepX, but this is used on the y-axis direction.
- Type: number
- Default: slideItemHeight

### disableSetWidth
In default, slide plugin will give the slider wrapper element a width value which is calculated according to the width of a slider item and the number of slider items when scrolling in the x direction. If you want to set the width of slider wrapper by yourself, you need to prohibit this default action by setting this value to false, otherwise your settings of slider wrapper width will be overwrite.
- Type: boolean
- Default: false

## api

### next(time, easing)
switch to next page

**Arguments**

|Name|Type|Description|
|----------|:-----:|:-----------|
|time|number|animation duration time|
|easing|Object|easing function, usually don't suggest modifying. If you really need to modify, please refer to `slide.easing`|

**Return**：void

### prev(time, easing)
switch to previous page

**Arguments**

|Name|Type|Description|
|----------|:-----:|:-----------|
|time|number|animation duration time|
|easing|Object|easing function, usually don't suggest modifying. If you really need to modify, please refer to `slide.easing`|

**Return**：void

### goToPage(x, y, time, easing)
In slide component, slide usually has several pages. Use this method scroll to specific page.

**Arguments**

|Name|Type|Description|
|----------|:-----:|:-----------|
|x|number|index of horizontal axis page|
|y|number|index of vertical axis page|
|time|number|animation duration time|
|easing|Object|easing function when switching. Refer `slide.easing` option|

**Return**: void

### getCurrentPage()
Get information of current page

**Arguments**: void

**Reture**: Object。

|Name|Type|Description|
|----------|:-----:|:-----------|
|x|number|coordinate of current page on horizontal axis|
|y|number|coordinate of current page on vertical axis|
|pageX|number| page index on horizontal axis(starting from 0)|
|pageY|number| page index on horizontal axis(starting from 0)|
