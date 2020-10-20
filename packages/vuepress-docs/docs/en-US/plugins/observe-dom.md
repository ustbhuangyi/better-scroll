# observe-dom
Enable detection of content and content child DOM changes. When the plugin is used and these DOM elements change, `bs.refresh()` will be triggered. The observe-dom plugin has the following features:

- Debounce feature for CSS attributions which change frequently
- If the scroll elements change occurs during the scroll animation, refresh will not be triggered.

## Install

```bash
npm install @better-scroll/observe-dom --save

// or

yarn add @better-scroll/observe-dom
```

## Usage

  ```js
    import BScroll from '@better-scroll/core'
    import ObserveDOM from '@better-scroll/observe-dom'
    BScroll.use(ObserveDOM)

    new BScroll('.bs-wrapper', {
      //...
      observeDOM: true // init observe-dom plugin
    })
  ```

## Demo

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

:::warning
For version <= `2.0.5`, because the internal implementation of the plugin uses [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), it cannot detect whether the load of the img tag is complete, so for images with uncertain heights inside the content, you need to wait for the image to load before calling `bs.refresh()` to recalculate the scrollable size. If the browser does not support MutationObserver, the fallback inside the plugin is to recalculate the scrollable size every second.
:::