# pulldown

## Introduction

  The pulldown plugin provides BetterScroll with the ability to monitor pulldowns. The 'pullingDown' event is fired when a pulldown is successfully detected. Usually used to implement the interaction of loading more data after the list/page is pulled down.

## Install

```shell
npm install @better-scroll/pull-down@next --save

// or

yarn add @better-scroll/pull-down@next
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pulldown'

BScroll.use(PullDown)
```

Then, To instantiate BetterScroll, you need to pass the pulldown related configuration item `pullDownRefresh`:

```js
new BScroll('.bs-wrap', {
  scrollY: true,
  pullDownRefresh: true
})
```

## Demo

<demo qrcode-url="pulldown/">
  <template slot="code-template">
    <<< @/examples/vue/components/pulldown/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/pulldown/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/pulldown/default.vue?style
  </template>
  <pulldown-default slot="demo"></pulldown-default>
</demo>

## Options pullDownRefresh

The default is false. When set to true or an Object, pull-down refresh can be turned on. When the configuration item is an Object, it has the following properties:

|Name|Type|Description|Default|
|----------|:-----:|:-----------|:--------:|
| threshold | number | Configure the distance from the top to determine if available trigger 'pullingDown' | 90 |
| stop | number | Rebound distance | 40 |

## API

### `finishPullDown()`

  - **Introduction**：Identifies the end of a pulldown action.
  - **Parameters**: None
  - **Returen value**: None

::: warning

Note: **The `finishPullDown()` method should be called at the end of the callback function each time a `pullingDown` event is triggered. The next `pullingDown` event will not fire until the `finishPullDown()` method is called.**

:::

### `openPullDown(config: pullDownRefreshOptions = true)`

  - **Introduction**：Turn on the pull-down refresh function. This method does not need to be called if the `pullDownRefresh` configuration is not `false` when BetterScroll is instantiated.
  - **Parameters**：`config: boolean | { threshold: number, stop: number }`, The parameter is the pullDownRefresh configuration. The default is false.
  - **Returen value**: None

### `closePullDown()`

  - **Introduction**：Turn off pulldown.
  - **Parameters**: None
  - **Returen value**: None

## Hooks

### `pullingDown`

- **Parameters**: None
- **Trigger**：A `pullingDown` event is fired when the top pull-down distance is greater than the `threshold` value after touchend.
