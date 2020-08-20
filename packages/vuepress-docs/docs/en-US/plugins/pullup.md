# pullup

## Introduction

  The pullup plugin provides BetterScroll with the ability to monitor pulldown operation.

## Install

```bash
npm install @better-scroll/pull-up@next --save

// or

yarn add @better-scroll/pull-up@next
```

## Usage

First, install the plugin via the static method `BScroll.use()`

```js
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'

BScroll.use(PullUp)
```

pass in the correct configuration in [options](./pullup.html#pullupload-options), for example:

```js
new BScroll('.bs-wrapper', {
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

## pullUpLoad Options

### threshold

  - **Type**: `number`
  - **Default**: `0`

    The threshold for triggering a `pullingUp` hook.

## Instance Methods

### `finishPullUp()`

  - **Details**: End the pullUpLoad behavior.
  - **Arguments**: None
  - **Returns**: None

::: warning

Every time you trigger the `pullingUp` hook, you should **actively call** `finishPullUp()` to tell BetterScroll to be ready for the next pullingUp hook.

:::

### `openPullUp(config: PullUpLoadOptions = {})`

  - **Details**: Turn on the pullUpLoad dynamically.
  - **Arguments**:
    - `{ PullDownRefreshOptions } config`: Modify the option of the pullup plugin
    - `PullDownRefreshOptions`:

    ```typescript
    export type PullUpLoadOptions = Partial<PullUpLoadConfig> | true

    export interface PullUpLoadConfig {
      threshold: number
      stop: number
    }
    ```
  - **Returns**: None

::: warning
The **openPullUp** method should be used with **closePullUp**, because in the process of generating the pullup plugin, the pullUpLoad action has been automatically monitored.
:::

### `closePullUp()`

  - **Details**: Turn off pullUpLoad dynamically.
  - **Arguments**: None
  - **Returns**: None

## Hooks

### `pullingUp`

- **Arguments**: None
- **Trigger**: When the distance to the bottom is less than the value of `threshold`, a `pullingUp` hook is triggered.

::: danger Note
After the pullUpLoad action is detected, the consumption opportunity of the `pullingUp` hook is only once, so you need to call `finishPullUp()` to tell BetterScroll to provide the next consumption opportunity of the `pullingUp` hook.
:::