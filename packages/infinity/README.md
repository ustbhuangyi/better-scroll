# @better-scroll/infinity

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/infinity/README_zh-CN.md)

The ability to inject a infinity load for BetterScroll.

## Usage

```js
import BScroll from '@better-scroll/core'
import Infinity from '@better-scroll/infinity'
BScroll.use(Infinity)

const bs = new BScroll('.wrapper', {
  infinity: {
    fetch(count) {
      // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
      // 成功获取数据后，你需要 resolve 数据数组（也可以 resolve 一个 Promise）。
      // 数组的每一个元素是列表数据，在 render 方法执行的时候会传递这个数据渲染。
      // 如果没有数据的时候，你可以 resolve(false)，来告诉无限滚动列表已经没有更多数据了。
    }
    render(item, div) {
      // 渲染每一个元素节点，item 是数据，div 是包裹元素节点的容器。
      // 该函数需要返回渲染后的 DOM 节点。
    },
    createTombstone() {
      // 返回一个墓碑 DOM 节点。
    }
  }
})
```
