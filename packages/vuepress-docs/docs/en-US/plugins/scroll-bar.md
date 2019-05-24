# scrollbar

## Introduciton

  The scrollbar plugin provides a nice scrollbar for BetterScroll.

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scrollbar'

BScroll.use(ScrollBar)
```

Then, To instantiate BetterScroll, you need to pass the scrollbar related configuration item `scrollbar`:

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  scrollbar: true
})
```

## Demo

<demo qrcode-url="scrollbar/default">
  <template slot="code-template">
    <<< @/examples/vue/components/scrollbar/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/scrollbar/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/scrollbar/default.vue?style
  </template>
  <scrollbar-default slot="demo"></scrollbar-default>
</demo>

## Options scrollbar

The default is false. When set to true or an Object, scrollbar can be turned on. When the configuration item is an Object, it has the following properties:

|Name|Type|Description|Default|
|----------|:-----:|:-----------|:--------:|
| fade | boolean | When the scroll stops, the scroll bar fades out | true |
| interactive | boolean | Whether scroll bars can interact | false |
