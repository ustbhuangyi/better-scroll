# better-scroll

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/nested-scroll/README_zh-CN.md)

nestedScroll is a plugin which helps you solve the trouble of nested Scroll

## Usage

```js
  import BScroll from 'better-scroll'
  import NestedScroll from '@better-scroll/nested-scroll'

  BScroll.use(NestedScroll)

  // parent bs
  new BScroll('.outerWrapper', {
    nestedScroll: true
  })
  // child bs
  new BScroll('.innerWrapper', {
    nestedScroll: true
  })
```
