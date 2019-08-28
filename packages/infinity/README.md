# @better-scroll/infinity

[中文文档](https://github.com/ustbhuangyi/better-scroll/blob/master/packages/infinity/README_zh-CN.md)

The ability to inject a infinity load for BetterScroll.

## Usage

```js
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'
BScroll.use(InfinityScroll)

const bs = new BScroll('.wrapper', {
  infinity: {
    fetch(count) {
      // Fetch data that is larger than count, the function is asynchronous, and it needs to return a Promise.。
      // After you have successfully fetch the data, you need resolve an array of data (or resolve Promise).
      // Each element of the array is list data, which will be rendered when the render method executes。
      // If there is no data, you can resolve (false) to tell the infinite scroll list that there is no more data。
    }
    render(item, div) {
      // Rendering each element node, item is data, and div is a container for wrapping element nodes.
      // The function needs to return to the rendered DOM node.
    },
    createTombstone() {
      // Returns a tombstone DOM node.。
    }
  }
})
```
