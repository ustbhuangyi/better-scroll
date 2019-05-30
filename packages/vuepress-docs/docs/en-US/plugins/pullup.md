# pullup

## Introduction

  The pullup plugin provides BetterScroll with the ability to monitor pullups. The 'pullingUp' event is triggered when a pull up is successfully detected. Usually used to implement list/page scrolling to the bottom, pull up to load more data.

## Install

```shell
npm install @better-scroll/pull-up@next --save

// or

yarn add @better-scroll/pull-up@next
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
```

Then, To instantiate BetterScroll, you need to pass the pullup related configuration item `pullUpLoad`:

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  pullUpLoad: true
})
```

## Demo

<demo qrcode-url="pullup/">
  <template slot="code-template">
    <<< @/examples/vue/components/pullup/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/pullup/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/pullup/default.vue?style
  </template>
  <pullup-default slot="demo"></pullup-default>
</demo>

## Options: pullUpLoad

The default is false. When set to true or an Object, pull-up loading can be turned on. When the configuration item is an Object, it has the following properties:

|Name|Type|Description|Default|
|----------|:-----:|:-----------|:--------:|
| threshold | number | Threshold for triggering a pullup event | 0 |

## API

### `finishPullUp()`

  - **Introduction**：Identifies the end of a pull-up loading action.
  - **Parameters**: None
  - **Return value**: None

::: warning

Note: **The `finishPullUp()` method should be called at the end of the callback function each time the pullup event is triggered. The next `pullingUp` event will not fire until the `finishPullUp()` method is called.**

:::

### `openPullUp(config: pullUpLoadOptions = true)`

  - **Introduction**：Turn on the pull-up loading function. This method does not need to be called if the `pullUpLoad` configuration item is not `false` when BetterScroll is instantiated.
  - **Parameters**：`config: boolean | { threshold: number }` ，The parameter is the pullUpLoad configuration. The default is false.
  - **Return value**：None

### `closePullUp()`

  - **Introduction**：Turn off pullup.
  - **Parameters**: None
  - **Return value**：None

### `autoPullDownRefresh()`

  - **Introduction**：Auto pulldown-refresh。
  - **Parameters**：None
  - **Return value**：None

## Hooks

### `pullingUp`

- **params**: None
- **trigger**：A `pullingUp` event is fired when the distance scrolls to the bottom less than the `threshold` value.
