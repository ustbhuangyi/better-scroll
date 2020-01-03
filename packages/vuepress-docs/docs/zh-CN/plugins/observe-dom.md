# observe-dom

开启对 scroll 区域 DOM 改变的探测。当插件被使用后，当 scroll 的 dom 元素发生时，将会触发 scroll 的 refresh 方法。 observe-dom 插件具有以下几个特性：

- 针对改变频繁的 css 属性，增加 debounce
- 如果改变发生在 scroll 动画过程中，则不会触发 refresh

## 安装

```bash
npm install @better-scroll/observe-dom@next --save

// or

yarn add @better-scroll/observe-dom@next
```

## 使用

  ```js
    import BScroll from '@better-scroll/core'
    import ObserveDOM from '@better-scroll/observe-dom'
    BScroll.use(ObserveDOM)

    new BScroll('.bs-wrap', {
      //...
      observeDOM: true // 设置 observeDOM 值为 true
    })
  ```
