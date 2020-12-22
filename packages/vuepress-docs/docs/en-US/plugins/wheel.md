# wheel

## Introduction

The wheel plugin is the cornerstone for implementing similar IOS Picker components.

## Install

```bash
npm install @better-scroll/wheel --save

// or

yarn add @better-scroll/wheel
```

## Usage

import `wheel`, then call `BScroll.use()`.

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)
```

pass in the correct configuration in options, for example:

```js
  let bs = new BScroll('.bs-wrapper', {
    wheel: true // wheel options
  })
```

:::tip
Wheel options is `true` or object, otherwise the plugin is invalid, please refer to [wheel options](./wheel.html#wheel-options).
:::

::: danger
BetterScroll combined with the Wheel plugin is just the JS logic part of the Picker effect, and the DOM template is user-implemented. Fortunately, for most Picker scenarios, we have corresponding examples.
:::

- **Basic usage**

  <demo qrcode-url="picker/one-column" :render-code="true">
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

### selectedIndex

  - **Type**: `number`
  - **默认值**：`0`

  Instantiate the Wheel, the `selectedIndex` item is selected by default, and the index starts from 0.

### rotate

  - **Type**: `number`
  - **Default**: `25`

  When rolling the wheel, the degree of bending of the wheel item.

### adjustTime

  - **Type**: `number`
  - **Default**: `400`(ms)

  When an item is clicked, the duration of scroll.

### wheelWrapperClass

  - **Type**: `string`
  - **Default**: `wheel-scroll`

  The className of the scroll element, where "scroll element" refers to the `content` element of BetterScroll.

### wheelItemClass

  - **Type**: `string`
  - **Default**: `wheel-item`

  The style of the child elements of the scroll element.

### wheelDisabledItemClass

  - **Type**: `string`
  - **Default**: `wheel-disabled-item`

  The child element that you want to disable in the scroll element is similar to the effect of the disabled option in the select element. The wheel plugin judges whether the item is designated as disabled according to the `wheelDisabledItemClass` configuration.

## Instance Methods

:::tip
All methods are proxied to BetterScroll instance, for example:

```js
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)

const bs = new BScroll('.bs-wrapper', {
  wheel: true
})

bs.getSelectedIndex()
bs.wheelTo(1, 300)
```
:::

### getSelectedIndex()

  - **Returns**: The index of the currently selected item, the subscript starts from 0

  Get the index of the currently selected item.

### wheelTo(index = 0, time = 0, [ease])

  - **Arguments**:
    - `{ number } index`
    - `{ number } time`: Animation duration
    - `{ number } ease<Optional>`: Ease effect configuration, refer to [ease.ts](https://github.com/ustbhuangyi/better-scroll/blob/dev/packages/shared-utils/src/ease.ts), the default is `bounce` effect
    ```typescript
    interface EaseItem {
      style: string
      fn(t: number): number
    }
    ```

  Scroll to the list item corresponding to the index.
