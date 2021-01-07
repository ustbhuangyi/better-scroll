# slide

## Introduction

slide expands the ability of carousel for BetterScroll.

## Install

```bash
npm install @better-scroll/slide --save

// or

yarn add @better-scroll/slide
```

## Usage

import `slide`, then call `BScroll.use()`.

```js
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'

  BScroll.use(Slide)
```

pass in the correct configuration in options, for example:

```js
  new BScroll('.bs-wrapper', {
    scrollX: true,
    scrollY: false,
    slide: {
      threshold: 100
    },
    momentum: false,
    bounce: false,
    stopPropagation: true
  })
```

The following is related to `slide` plugin and [BetterScroll configuration](../guide/base-scroll-options.html):

- **slide(for plugin)**

  Enable zoom functionality. That is to say, the zoom plugin won't work without the zoom options, see [slide options](./slide.html#slide-options).

- **scrollX**

  When the value is true, set the direction of slide to **horizontal**.

- **scrollY**

  When the value is true, set the direction of slide to **vertical**. **Note: scrollX and scrollY cannot be set to true at the same time**

- **momentum**

  When using slide, this value needs to be set to false to avoid the problem of flickering during fast scrolling caused by inertial animation and the problem of scrolling multiple pages at a time during fast sliding.

- **bounce**

  The bounce value needs to be set to false, otherwise it will flicker when the loop is true.

- **probeType**

  If you want to register the `slideWillChange` event to get the change of the PageIndex of the slide in real time when the user drags the slide, you need to set the probeType value to 2 or 3.

## Terms about slide

In general, the layout of BetterScroll's slide is as follows:

```html
<div class="slide-wrapper">
  <div class="slide-content">
    <div class="slide-page"><div>
    <div class="slide-page"><div>
    <div class="slide-page"><div>
    <div class="slide-page"><div>
  <div/>
<div/>
```

- **slide-wrapper**

  slide container.

- **slide-content**

  slide scroll element.

- **slide-page**

  slide is composed of multiple Pages.

  ::: tip
  In the loop scenario, two more pages will be inserted before and after the slide-content to achieve the visual effect of seamless scrolling.
  :::

  :::danger
  The slide-content must have at least one slide-page, if there is only one page, the loop configuration is invalid
  :::

## Demo

- **Horizontal Slide**

  <demo qrcode-url="slide/banner" :render-code="true">
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

- **Fullscreen Slide**

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

- **Vertical Slide**

  <demo qrcode-url="slide/vertical">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/vertical.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/vertical.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/vertical.vue?style
    </template>
    <slide-vertical slot="demo"></slide-vertical>
  </demo>

- **Dynamic Slide(v2.1.0)**

  <demo qrcode-url="slide/dynamic">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/dynamic.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/dynamic.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/dynamic.vue?style
    </template>
    <slide-dynamic slot="demo"></slide-dynamic>
  </demo>

  ::: tip
  Note: When setting `useTransition = true`, there may be flickering on some iPhone systems. You need to add the following two additional styles to each `slide-page` like the code in the above demo:

  ```css
  transform: translate3d(0,0,0)
  backface-visibility: hidden
  ```
  :::

## slide options

:::tip
When `slide` is configured as `true`, the plugin uses the default plugin option.

```js
const bs = new BScroll('.wrapper', {
  slide: true
})

// equals

const bs = new BScroll('.wrapper', {
  slide: {
    loop: true,
    threshold: 0.1,
    speed: 400,
    easing: ease.bounce,
    listenFlick: true,
    autoplay: true,
    interval: 3000
  }
})
```
:::

### loop

  - **Type**: `boolean`
  - **Default**: `true`

  Is it possible to loop. But when there is only one element, this setting does not take effect.

### autoplay

  - **Type**: `boolean`
  - **Default**: `true`

  Whether to enable auto play.

### interval

  - **Type**: `number`
  - **Default**: `3000`

  The interval before the next play.

### speed

  - **Type**: `number`
  - **Default**: `400`

  the default duration of Page animation.

### easing

  - **Type**: `EaseItem`
    - `{ string } style`: for `transition-timing-function`
    - `{ Function } fn`: When setting `useTransition:false`, the animation curve is determined by `easing.fn`.
  - **Default**:
  ```js
  {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function(t: number) {
      return 1 - --t * t * t * t
    }
  }
  ```

  Scrolling easing effect.

### listenFlick

  - **Type**: `boolean`
  - **Default**: `true`

  When quickly flicking across the slide area, it will trigger the switch to the previous/next page. Set listenFlick to false to turn off the effect.

### threshold

  - **Type**: `number`
  - **Default**: `0.1`

  :::tip
  When the scrolling distance is less than the threshold, the switch to the next or previous one will not be triggered.

  It can be set to a decimal, such as 0.1, or an integer, such as 100. When the value is a decimal, the threshold is treated as a percentage, and the final threshold is `slideWrapperWidth * threshold` or `slideWrapperHeight * threshold`. When the value is an integer, the threshold is threshold.
  :::

  Switch the threshold of the next or previous Page.

## Instance Methods

:::tip
All methods are proxied to BetterScroll instance, for example:

```js
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const bs = new BScroll('.bs-wrapper', {
  slide: true
})

bs.next()
bs.prev()
bs.getCurrentPage()
```
:::

### next([time], [easing])

  - **Arguments**:
    - `{ number } time<Optional>`: Animation duration, default is `options.speed`
    - `{ EaseItem } easing<Optional>`: Ease effect configuration, refer to [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts), the default is `bounce` effect
    ```typescript
    interface EaseItem {
      style: string
      fn(t: number): number
    }
    ```

  Scroll to the next page.

### prev([time], [easing])

  - **Arguments**:
    - `{ number } time<Optional>`: Animation duration, default is `options.speed`
    - `{ EaseItem } easing<Optional>`: Ease effect configuration, refer to [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts), the default is `bounce` effect

  Scroll to the previous page.

### goToPage(pageX, pageY, [time], [easing])

  - **Arguments**:
    - `{ number } pageX`: Scroll horizontally to the Page of the corresponding index, the subscript starts from 0
    - `{ number } pageY`: Scroll vertically to the Page of the corresponding index, the subscript starts from 0
    - `{ number } time<Optional>`: Animation duration, default is `options.speed`
    - `{ EaseItem } easing<Optional>`: Ease effect configuration, refer to [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts), the default is `bounce` effect

  Scroll to the specified page.

### getCurrentPage()

  - **Returns**: `page`
  ```typescript
  type Page = {
    x: number,
    y: number,
    pageX: number, // pageIndex in horizontal direction
    pageY: number  // pageIndex in vertical direction
  }
  const page:Page = BScroll.getCurrentPage()
  ```

  Get currentPage.

### startPlay()

  If the loop configuration is turned on, manually turn on autoplay.

### pausePlay()

  If the loop configuration is turned on, manually turn off autoplay.

## Events

### slideWillChange

  - **Arguments**: `page` object
    - `{ number } x`: The x value of the page to be displayed
    - `{ number } y`: The y value of the page to be displayed
    - `{ number } pageX`: The index value of the horizontal page to be displayed, the subscript starts from 0
    - `{ number } pageY`: The index value of the vertical page to be displayed, the subscript starts from 0

  - **Trigger timing**: When the currentPage value of slide is about to change

  - **Usage**:

  In the banner, it is often accompanied by a dot legend to indicate which page the current banner is on, such as the "Horizontal Slide" example above. When the user drags the banner to the next one, we hope the dot legend below will change synchronously. As shown below

  <img data-zoomable :src="$withBase('/assets/images/slide-pageindex.png')" style="maxHeight: 200px" alt="banner示例图">

  This effect can be achieved by register the `slideWillChange` event. code show as below:

  ```js
    let currentPageIndex
    const slide = new BScroll(this.$refs.slide, {
      scrollX: true,
      scrollY: false,
      slide: {
        threshold: 100
      },
      momentum: false,
      bounce: false,
      probeType: 2
    })
    slide.on('slideWillChange', (page) => {
      currentPageIndex = page.pageX
    })
  ```

### slidePageChanged(v2.1.0)

  - **Arguments**: `page` object
    - `{ number } x`: The x value of the current page
    - `{ number } y`: The y value of the current page
    - `{ number } pageX`: The index value of the horizontal page, the subscript starts from 0
    - `{ number } pageY`: The index value of the vertical page, the subscript starts from 0

  - **Trigger timing**: When slide page has changed

  ```js
    const slide = new BScroll(this.$refs.slide, {
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false
    })
    slide.on('slidePageChanged', (page) => {
      currentPageIndex = page.pageX
    })
  ```