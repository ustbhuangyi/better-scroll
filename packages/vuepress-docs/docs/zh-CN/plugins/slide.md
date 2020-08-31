# slide

## 介绍

slide 为 BetterScroll 扩展了轮播焦点图的能力。

## 安装

```bash
npm install @better-scroll/slide --save

// or

yarn add @better-scroll/slide
```

## 使用

你需要首先引入 slide 插件，并通过静态方法 `BScroll.use()` 使用

```js
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'

  BScroll.use(Slide)
```

上面步骤完成后，BScroll 的 `options` 中传入 slide 相关的配置。

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

以下是 slide 插件专属以及[ BetterScroll 的配置](../guide/base-scroll-options.html)：

- **slide<插件专属>**

  开启 slide 功能。若没有该项，则插件不会生效。该配置同时也是用来设置 slide 特性的相关配置，具体请参考[ slide 选项对象](./slide.html#slide-选项对象)。

- **scrollX**

  当值为 true 时，设置 slide 的方向为**横向**。

- **scrollY**

  当值为 true 时，设置 slide 的方向为**纵向**。 **注意: scrollX 和 scrollY 不能同时设置为 true**

- **momentum**

  当使用 slide 时，这个值需要设置为 false，用来避免惯性动画带来的快速滚动时的闪烁的问题和快速滑动时一次滚动多页的问题。

- **bounce**

  bounce 值需要设置为 false，否则会在循环衔接的时候出现闪烁。

- **probeType**

  如果你想通过监听 `slideWillChange` 钩子，在用户拖动 slide 时，实时获取到 slide 的 PageIndex 的改变，需要设置 probeType 值为 2 或者 3。

## 关于 slide 的术语

一般情况下，BetterScroll 的 slide 的布局如下：

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

  slide 容器。

- **slide-content**

  slide 滚动元素。

- **slide-page**

  slide 由多个 Page 组成。

  ::: tip
  在 loop 的场景下，slide-content 前后会多插入两个 Page，以便实现无缝衔接滚动的视觉效果。
  :::

## 示例

- **横向轮播**

  <demo qrcode-url="slide/banner" render-code="true">
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

- **全屏轮播**

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

- **纵向轮播**

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

  ::: tip
  注意：当设置 `useTransition = true`时，可能在 iphone 某些系统上出现闪烁。你需要像上面 demo 中的代码一样，每个 `slide-page` 额外增加下面两个样式：

  ```css
    transform: translate3d(0,0,0)
    backface-visibility: hidden
  ```
  :::

## slide 选项对象

### loop

  - **类型**：`boolean`
  - **默认值**：`true`

  是否可以循环。但是当只有一个元素的时候，该设置不生效。

### autoplay

  - **类型**：`boolean`
  - **默认值**：`true`

  是否开启自动播放。

### interval

  - **类型**：`number`
  - **默认值**：`3000`

  距离下一次播放的间隔。

### speed

  - **类型**：`number`
  - **默认值**：`400`

  切换 Page 动画的默认时长。

### easing

  - **类型**：`EaseItem`
    - `{ string } style`：用来设置过度动画的 `transition-timing-function` 值。
    - `{ Function } fn`：当设置 `useTransition:false` 时，由 `easing.fn` 来确定动画曲线。
  - **默认值**：
  ```js
  {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function(t: number) {
      return 1 - --t * t * t * t
    }
  }
  ```

  滚动的缓动效果配置。

### listenFlick

  - **类型**：`boolean`
  - **默认值**：`true`

  当快速轻抚过 slide 区域时，会触发切换上一页/下一页。设置 listenFlick 为 false，可关闭该效果。

### threshold

  - **类型**：`number`
  - **默认值**：`0.1`

  切换下一个或上一个 Page 的阈值。

  :::tip
  当滚动距离小于该阈值时，不会触发切换到下一个或上一个。

  可以设置为小数，如 0.1，或者整数，如 100。当该值为小数时，threshold 被当成一个百分比，最终的阈值为 `slideWrapperWidth * threshold` 或者 `slideWrapperHeight * threshold`。当该值为整数时，则阈值就是 threshold。
  :::

## 实例方法

### next([time], [easing])

  - **参数**：
    - `{ number } time<可选>`：动画时长，默认是 `options.speed`
    - `{ EaseItem } easing<可选>`：缓动效果配置，参考 [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts)，默认是 `bounce` 效果
    ```typescript
    interface EaseItem {
      style: string
      fn(t: number): number
    }
    ```

  - **返回值**：无

  滚动到下一张。

### prev([time], [easing])

  - **参数**：
    - `{ number } time<可选>`：动画时长，默认是 `options.speed`
    - `{ EaseItem } easing<可选>`：缓动效果配置，参考 [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts)，默认是 `bounce` 效果

  - **返回值**：无

  滚动到上一张。

### goToPage(pageX, pageY, [time], [easing])

  - **参数**：
    - `{ number } pageX`：横向滚动到对应索引的 Page，下标从 0 开始
    - `{ number } pageY`：纵向滚动到对应索引的 Page，下标从 0 开始
    - `{ number } time<可选>`：动画时长，默认是 `options.speed`
    - `{ EaseItem } easing<可选>`：缓动效果配置，参考 [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts)，默认是 `bounce` 效果

  - **返回值**：无

  滚动到指定的 Page 位置。

### getCurrentPage()

  - **参数**： 无

  - **返回值**： `page`
  ```typescript
  type Page = {
    x: number,
    y: number,
    pageX: number, // 横向对应 Page 的索引，下标从 0 开始
    pageY: number  // 纵向对应 Page 的索引，下标从 0 开始
  }
  const page:Page = BScroll.getCurrentPage()
  ```

  获取当前页面的信息。

### startPlay()

  - **参数**：无

  - **返回值**：无

  如果开启了 loop 的配置，手动开启循环播放。

### pausePlay()

  - **参数**：无

  - **返回值**：无

  如果开启了 loop 的配置，手动关闭循环播放。

## 事件

### slideWillChange

  - **参数**：page 对象
    - `{ number } x`：即将展示页面的 x 坐标值
    - `{ number } y`：即将展示页面的 y 坐标值
    - `{ number } pageX`：即将展示的横向页面的索引值，下标从 0 开始
    - `{ number } pageY`：即将展示的纵向页面的索引值，下标从 0 开始

  - **触发时机**：slide 的 currentPage 值将要改变时

  - **用法**：

  在 banner 展示中，常常伴随着一个 dot 图例，来指示当前 banner 是第几页，例如前面“横向轮播图”的示例。当用户拖动 banner 出现下一张时，我们希望下面的 dot 图例会同步变换。如下图

  <img :src="$withBase('/assets/images/slide-pageindex.png')" style="maxHeight: 200px" alt="banner示例图">

  通过监听 `slideWillChange` 事件，可以实现该效果。代码如下：

  ```js
    let currentPageIndex // 控制当前页面
    const slide = new BScroll(this.$refs.slide, {
      scrollX: true,
      scrollY: false,
      slide: {
        threshold: 100
      },
      useTransition: true,
      momentum: false,
      bounce: false,
      stopPropagation: true,
      probeType: 2
    })
    slide.on('slideWillChange', (page) => {
      currentPageIndex = page.pageX
    })
  ```

