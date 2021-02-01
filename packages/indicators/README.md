# @better-scroll/indicators

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/indicators/README_zh-CN.md)

Indicator can be used to achieve magnifying glass, parallax scrolling and other effects.

## Usage

```js
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'
BScroll.use(Indicators)

const bs = new BScroll('.wrapper', {
  indicators: [
    relationElement: someHTMLElement
  ]
})
```

```ts
interface IndicatorOptions {
  interactive?: boolean
  ratio?: Ratio
  relationElementHandleElementIndex?: number
  relationElement: HTMLElement
}
```