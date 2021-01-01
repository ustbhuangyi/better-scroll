# observe-image

## 介绍

开启对 wrapper 子元素中图片元素的加载的探测。无论图片的加载成功与否，都会自动调用 BetterScroll 的 refresh 方法来重新计算可滚动的宽度或者高度，新增于 v2.1.0 版本。

:::tip 提示
对于已经用 CSS 确定图片宽高的场景，不应该使用该插件，因为每次调用 refresh 对性能会有影响。只有在**图片的宽度或者高度不确定**的情况下，你才需要它。
:::

## 安装

```bash
npm install @better-scroll/observe-image --save

// or

yarn add @better-scroll/observe-image
```

## 使用

```js
  import BScroll from '@better-scroll/core'
  import ObserveImage from '@better-scroll/observe-image'
  BScroll.use(ObserveImage)

  new BScroll('.bs-wrapper', {
    //...
    observeImage: true // 开启 observe-image 插件
  })
```

## 示例

  <demo qrcode-url="observe-image/" :render-code="true">
    <template slot="code-template">
      <<< @/examples/vue/components/observe-image/default.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/observe-image/default.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/observe-image/default.vue?style
    </template>
    <observe-image-default slot="demo"></observe-image-default>
  </demo>

## observeImage 选项对象

### debounceTime

  - **类型：** `number`
  - **默认值：** `100`

    探测到图片加载成功或者失败后，过 debounceTime 毫秒后才会调用 refresh 方法，重新计算可滚动的高度或者宽度，如果在 debounceTime 毫秒内有多张图片加载成功或者失败，**只会调用一次 refresh**。

    :::tip 提示
    当 debounceTime 为 0 的时候，会立马调用 **refresh** 方法，而不是使用 **setTimeout**。
    :::