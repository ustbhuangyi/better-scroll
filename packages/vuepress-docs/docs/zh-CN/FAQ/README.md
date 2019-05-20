# FAQ

### 为什么 BetterScroll 初始化不能滚动？

BetterScroll 滚动原理是 content 元素的高度／宽度超过 wrapper 元素的高度／宽度。而且，如果你的 content 元素含有不固定尺寸的图片，你必须在图片加载完之后，调用 `refresh()` 方法来确保高度计算正确。还存在一种情况是页面存在表单元素，弹出键盘之后，将页面的适口高度压缩，导致 bs 不能正常工作，依然是调用 `refresh()` 方法。

### 为什么 BetterScroll 区域的点击事件无法被触发？

BetterScroll 默认会阻止浏览器的原生 click 事件。如果你想要 click 事件生效，BetterScroll 会派发一个 click 事件，并且 event 参数的 `_constructed` 为 true。配置项如下：

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  click: true
})
```

### 为什么我的 BetterScroll 监听 `scroll` 钩子，监听器不执行？

BetterScroll 通过 probeType 配置项来决定是否派发 `scroll` 钩子，因为这是有一些性能损耗的。probeType 为 2 的时候会实时的派发事件，probeType 为 3 的时候会在 momentum 动量动画的时候派发事件。建议设置为 3。

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  probeType: 3
})
```

### slide 用了横向滚动，发现在 slide 区域纵向滚动无效？

如果想要保留浏览器的原生纵向滚动，需要如下配置项：

```js
import BScroll from '@better-scroll/core'

let bs = new BScroll('./div', {
  eventPassthrough: 'vertical'
})
```
