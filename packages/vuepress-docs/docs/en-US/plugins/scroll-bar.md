# scrollbar

## Introduciton

The scrollbar plugin provides a nice scrollbar for BetterScroll.

:::tip
For v2.2.0, users can provide custom scroll bars.
:::

## Install

```bash
npm install @better-scroll/scroll-bar --save

// or

yarn add @better-scroll/scroll-bar
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'

BScroll.use(ScrollBar)
```

pass correct [scrollbar options](./scroll-bar.html#scrollbar-options)

```js
new BScroll('.bs-wrapper', {
  scrollY: true,
  scrollbar: true
})
```

## Demo

  - **Vertical Scrollbar**

    <demo qrcode-url="scrollbar/vertical" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/vertical.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/vertical.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/vertical.vue?style
      </template>
      <scrollbar-vertical slot="demo"></scrollbar-vertical>
    </demo>

  - **Horizontal Scrollbar**

    <demo qrcode-url="scrollbar/horizontal" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?style
      </template>
      <scrollbar-horizontal slot="demo"></scrollbar-horizontal>
    </demo>

  - **Custom Scrollbar**

    <demo qrcode-url="scrollbar/custom" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/custom.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/custom.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/custom.vue?style
      </template>
      <scrollbar-custom slot="demo"></scrollbar-custom>
    </demo>

  - **With Mousewheel**

    <demo qrcode-url="scrollbar/mousewheel" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?style
      </template>
      <scrollbar-mousewheel slot="demo"></scrollbar-mousewheel>
    </demo>


## scrollbar options

### fade

  - **Type**: `boolean`
  - **Default**: `true`

  When the scroll stops, the scrollbar fades out.

### interactive

  - **Type**: `boolean`
  - **Default**: `false`

  Whether scrollbar can interacted with.
### customElements <Badge text="2.2.0" />

  - **Type**: `HTMLElement[]`
  - **Default**: `[]`

  The user provides a custom scroll bar.

  ```js
  // horizontal
  const horizontalEl = document.getElementById('User-defined scrollbar')
  new BScroll('.bs-wrapper', {
    scrollY: true,
    scrollbar: {
      customElements: [horizontalEl]
    }
  })
  // vertical
  const verticalEl = document.getElementById('User-defined scrollbar')
  new BScroll('.bs-wrapper', {
    scrollY: false,
    scrollX: true,
    scrollbar: {
      customElements: [verticalEl]
    }
  })
  // freeScroll
  const horizontalEl = document.getElementById('User-defined scrollbar')
  const verticalEl = document.getElementById('User-defined scrollbar')
  new BScroll('.bs-wrapper', {
    freeScroll: true,
    scrollbar: {
      // When there are two scrollbars
      // the first element of the array is the horizontal
      customElements: [horizontalEl, verticalEl]
    }
  })
  ```

### minSize <Badge text="2.2.0" />

  - **Type**: `number`
  - **Default**: `8`

  The minimum size of the scrollbar. When the user provides a custom scrollbar, this configuration is invalid.

### scrollbarTrackClickable <Badge text="2.2.0" />

  - **Type**: `boolean`
  - **Default**: `false`

  Whether the scrollbar track allows clicking.

  **Note**：When enabling this configuration, please ensure that the `click` of BetterScroll Options is true, otherwise the click event cannot be triggered. [The reason is here](../FAQ/diagnosis.html#question-4-why-are-the-listeners-for-all-click-events-inside-betterscroll-content-not-triggered).

  ```js
  new BScroll('.bs-wrapper', {
    scrollY: true,
    click: true // essential
    scrollbar: {
      scrollbarTrackClickable: true
    }
  })
  ```

### scrollbarTrackOffsetType <Badge text="2.2.0" />

  - **Type**: `string`
  - **Default**: `'step'`

  After the scroll bar track is clicked, the calculation method of the scroll distance is the same as the browser's performance by default. It can be configured as `'clickedPoint'`, which means the scroll bar is scrolled to the clicked position.

### scrollbarTrackOffsetTime <Badge text="2.2.0" />

  - **Type**: `number`
  - **Default**: `300`

  the scroll time after the scrollbar track is clicked,.

:::tip
When `scrollbar` is configured as `true`, the plugin uses the default plugin option.

```js
const bs = new BScroll('.wrapper', {
  scrollbar: true
})

// equals

const bs = new BScroll('.wrapper', {
  scrollbar: {
    fade: true,
    interactive: false,
    // The following configuration items are only supported in v2.1.2
    customElements: [],
    minSize: 8,
    scrollbarTrackClickable: false,
    scrollbarTrackOffsetType: 'step',
    scrollbarTrackOffsetTime: 300
  }
})
```
:::
