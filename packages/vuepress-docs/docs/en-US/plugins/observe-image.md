# observe-image

## Introduction

Turn on the detection of the loading of image elements in the wrapper child element. Regardless of whether the image is loaded successfully or not, BetterScroll's `refresh` method is automatically called to recalculate the scrollable width or height, which was supported in v2.1.0.

:::tip
For scenes where CSS has been used to determine the width and height of the image, this plugin should not be used, because each call to refresh will affect performance. You only need it if the width or height of the image is uncertain.
:::

## Install

```bash
npm install @better-scroll/observe-image --save

// or

yarn add @better-scroll/observe-image
```

## Usage

```js
  import BScroll from '@better-scroll/core'
  import ObserveImage from '@better-scroll/observe-image'
  BScroll.use(ObserveImage)

  new BScroll('.bs-wrapper', {
    //...
    observeImage: true
  })
```

## Demo

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

## observeImage Options

### debounceTime

  - **Type**: `number`
  - **Default**: `100`

    After detecting the success or failure of the image loading, the refresh method will be called after **debounceTime** milliseconds to recalculate the scrollable height or width. If multiple images load successfully or fail within debounceTime milliseconds, the **refresh** method will only be called once.

    :::tip
    When **debounceTime** is 0, the **refresh** method will be called immediately instead of using **setTimeout**.
    :::