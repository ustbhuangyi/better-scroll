# observe-dom

开启对 content 以及 content 子元素 DOM 改变的探测。当插件被使用后，当这些 DOM 元素发生变化时，将会触发 scroll 的 refresh 方法。 observe-dom 插件具有以下几个特性：

- 针对改变频繁的 CSS 属性，增加 debounce
- 如果改变发生在 scroll 动画过程中，则不会触发 refresh

## 安装

```bash
npm install @better-scroll/observe-dom --save

// or

yarn add @better-scroll/observe-dom
```

## 使用

```js
  import BScroll from '@better-scroll/core'
  import ObserveDOM from '@better-scroll/observe-dom'
  BScroll.use(ObserveDOM)

  new BScroll('.bs-wrapper', {
    //...
    observeDOM: true // 开启 observe-dom 插件
  })
```

## 示例

  <demo qrcode-url="observe-dom/default" :render-code="true">
    <template slot="code-template">
      <<< @/examples/vue/components/observe-dom/default.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/observe-dom/default.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/observe-dom/default.vue?style
    </template>
    <observe-dom-default slot="demo"></observe-dom-default>
  </demo>


:::warning 注意
对于 `2.0.5` 版本及之前版本，由于插件的内部实现使用的是 [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)，它无法探测到 img 标签的是否加载完成，因此对于 content 内部含有不确定高度的图片，需要等图片加载完成再调用 bs.refresh() 来重新计算可滚动尺寸。如果浏览器不支持 MutationObserver，插件内部的降级方案是每秒重新计算可滚动的尺寸。
:::