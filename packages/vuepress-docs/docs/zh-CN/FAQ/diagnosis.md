# BetterScroll 的“疑难杂症”

### 【问题一】为什么我的 BetterScroll 滑动不了？

问题基本上出在于**高度的计算错误**。首先，你必须对 `BetterScroll` 的滚动原理有一个清晰的认识，对于竖向滚动，简单的来说就是 `wrapper` 容器的高度大于 `content` 内容的高度，修改 `transformY` 来达到滚动的目的，横向滚动的原理类似。那么计算**可滚动的高度**就是 BetterScroll 必备的逻辑。一般这个逻辑出错的场景在于：

  1. **存在不确定尺寸的图片**

      - **原因**

        js 执行计算可滚动高度的时候，图片还未渲染完成。

      - **解决**

        在图片的 onload 的回调函数里面调用 `bs.refresh()` 来确保得到正确的图片高度之后再计算**可滚动的高度**。

  2. **Vue 的 keep-alive 组件**

      - **场景**

        假设存在 A、B 两个被 `keep-alive` 包裹的组件，A 组件使用了 BetterScroll，在 A 组件做了某种操作，弹出输入键盘，之后进入到 B 组件，再返回 A 组件的时候，bs 无法滚动。

      - **原因**

        由于 Vue 的 keep-alive 的缓存加上输入键盘弹起时候，会压缩可视区域的高度，导致之前计算过的可滚动的高度有误。

      - **解决**

        可以在 Vue 的 `activated` 的钩子里面调用 `bs.refresh()` 重新计算高度或者重新实例化 bs。

### 【问题二】为什么我用 BetterScroll 做了横向滚动之后，纵向滚动失效？

BetterScroll 提供了 `slide` 的 feature。如果实现了一个横向滚动的 `slide`，在 `slide` 区域做竖向滚动的操作，无法冒泡到浏览器，这样就无法操纵原生浏览器的滚动条了。

- **原因**

  BetterScroll 内部的滚动计算存在于用户的交互，比如移动端就是 `touchstart/touchmove/touchend` 事件，这些事件的侦听器一般都有 `e.preventDefault()` 这一行代码，会阻止浏览器的默认行为，这样浏览器的滚动条无法被滚动。

- **解决**

  配置 `eventPassthrough` 属性。

  ```js
  let bs = new BScroll('.wrapper', {
    eventPassthrough: 'vertical' // 保持纵向的原生浏览器滚动
  })
  ```

### 【问题三】为什么我用 BetterScroll 之后，无法弹出长按图片保存等弹窗，以及为啥不能使用 `:active` CSS 类来实现按压态？

- **原因**

  在**问题二**已经提到了，`e.preventDefault()` 造成的。

- **解决**

  配置 `preventDefault` 属性。

  ```js
  let bs = new BScroll('.wrapper', {
    preventDefault: false
  })
  ```

### 【问题四】为什么 BetterScroll content 内部的所有的 click 事件的侦听器都不触发？

- **原因**

  依然是 `e.preventDefault()` 造成的。在移动端，如果你在 `touchstart/touchmove/touchend` 的逻辑里面调用 `e.preventDefault()`，会阻止它以及它子元素的 click 事件的执行。因此，BetterScroll 内部会管理 `click` 事件的派发，你只需要`click` 配置项即可。

- **解决**

  配置 `click` 属性。

  ```js
  let bs = new BScroll('.wrapper', {
    click: true
  })
  ```

### 【问题五】为什么在嵌套 BetterScroll 的时候，click 事件派发两次？

- **原因**

  正如**问题四**所说，BetterScroll 内部会派发 `click` 事件，并且嵌套场景肯定是存在两个或两个以上的 bs。

- **解决**

  你可以通过实例化 BetterScroll 的 `stopPropagation` 配置项来管理事件的冒泡，或者通过实例化 BetterScroll 的 `click` 配置项来防止 click 的多次触发。

### 【问题六】为什么我监听了 bs 的 scroll 事件，为啥回调不执行？

- **原因**

  BetterScroll 并不是在任何时刻都会派发 `scroll` 事件，因为获取 bs 的滚动位置是有一定的性能损耗。至于是否派发，是取决于 `probeType` 配置项。

- **解决**

  ```js
  let bs = new BScroll('.div', {
    probeType: 3 // 实时派发
  })
  ```

### 【问题七】在两个纵向嵌套的 bs 场景，为什么移动内层的 bs，会导致外层也被滚动。

- **原因**

  BetterScroll 的内部逻辑都在 touch 事件的侦听器函数体内，既然内部的 bs 的 touch 事件被触发，自然会冒泡到外层的 bs。

- **解决**

  既然知道原因，那么也有相对应的解决办法。比如在你滚动内层的 bs 时候，监听 scroll 事件，调用外层的 `bs.disable()` 来禁用外层的 bs。当内层的 bs 滚动到底部的时候，说明这个时候需要滚动外层的 bs，这个时候调用外层的 `bs.enable()` 来激活外层，并且调用内层的 `bs.disable()` 禁止内层滚动。其实仔细想一想，这个交互就跟原生 Web 的嵌套滚动行为表现一致，只不过浏览器帮你处理了各种滚动嵌套的逻辑，而在 BetterScroll 需要你自己通过派发的事件以及暴露的 API 来实现。

### 【问题八】在纵向 bs 嵌套横向 bs 的场景，为什么在横向 bs 的区域竖向移动不会使得外层纵向 bs 的垂直滚动？

- **原因**

  原因与**问题二**类似，还是因为 `e.preventDefault()` 影响了默认的滚动行为，导致外层的 bs 不会触发 touch 事件。

- **解决**

  解决办法就是配置内层的 bs 的 `eventPassthrough` 属性，让其保持默认的原生竖向滚动，

  ```js
  let innerBS = new BScroll('.wrapper', {
    eventPassthrough: 'vertical' // 保持纵向的原生浏览器滚动
  })
  ```