# wheel

## Introduction

The wheel plugin is the cornerstone for implementing similar IOS Picker components.

## Install

```bash
npm install @better-scroll/wheel@next --save

// or

yarn add @better-scroll/wheel@next
```

## Use

First import the wheel plugin and extend the capabilities of BetterScroll via the global method `BScroll.use()`.

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)
```

As long as the following configuration is passed, `bs` extends the capabilities of the wheel.

```js
let bs = new BScroll('.bs-wrap', {
  wheel: true // wheel options
})

let wheel = bs.plugins.wheel // wheel instance
```

:::tip
Wheel options is a truthy value or object, otherwise the plugin function is invalid, please refer to [wheel options](./wheel.html#wheel-options).
:::

## Pay attention

BetterScroll combined with the Wheel plugin is just the JS logic part of the Picker effect, and the DOM template is user-implemented. Fortunately, for most Picker scenarios, we have corresponding examples.

- **Basic usage**

  <demo qrcode-url="picker/one-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/one-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/one-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/one-column.vue?style
    </template>
    <picker-one-column slot="demo"></picker-one-column>
  </demo>

  Single-column Picker is a more common effect. You can use `selectedIndex` to configure the item that initializes the corresponding index. `wheelDisabledItemClass` configures the item you want to disable to simulate the Web Select tag's disable option.

- **Double-column Picker**

  <demo qrcode-url="picker/double-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/double-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/double-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/double-column.vue?style
    </template>
    <picker-double-column slot="demo"></picker-double-column>
  </demo>

  The JS logic part is not much different from the single-column selector. You will find that there is no correlation between the two column selectors because they are two different BetterScroll instances. If you want to achieve the effect of the provincial and city linkage, then add a part of the code to make the two BetterScroll instances can be associated. Please see the next example:

- **Linkage Picker**

  <demo qrcode-url="picker/linkage-column">
    <template slot="code-template">
      <<< @/examples/vue/components/picker/linkage-column.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/picker/linkage-column.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/picker/linkage-column.vue?style
    </template>
    <picker-linkage-column slot="demo"></picker-linkage-column>
  </demo>

  The effect of the city linkage Picker must be linked through the JS part of the logic to the different instances of BetterScroll.

## wheel options

|name|types|descriptions|default|
|----------|:-----:|:-----------|:--------:|
|selectedIndex|number|Initialize the selected items|0|
|rotate|number|`transform: rotate` style applied to wheel item|25|
|adjustTime|number|Time to correct to the correct index item when clicked|400|
|wheelWrapperClass|string|Container classname|'wheel-scroll'|
|wheelItemClass|string|The classname of the container child element item|'wheel-item'|
|wheelDisabledItemClass|string|disabled items's classname|'wheel-disabled-item'|

## API

### getSelectedIndex()

Get the index of the currently selected item.

**return**：The index of the currently selected item

### wheelTo(index = 0, time = 0, ease?: EaseItem, isSlient?: boolean)

Scroll to the item of the corresponding index.

**Arguments**

|name|types|descriptions|
|----------|:-----:|:-----------|
|index|number|Index(subscript starts at 0)|
|time|number|The duration of the animation, in milliseconds|
|ease|?:EaseItem|viewed in `packages/shared-utils/src/ease`, generally not passed|
|isSlient|?:boolean|Usually false, if true, then scroll and scrollEnd hooks will not be dispatched when time is 0|
