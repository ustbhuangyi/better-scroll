# API

如果想要彻底了解 BetterScroll，就需要了解其实例的常用属性、灵活的方法以及提供的钩子。

## 属性

有时候我们想基于 BetterScroll 做一些扩展，需要对 BetterScroll 的一些属性有所了解，下面介绍几个常用属性。

### x
  - 类型：Number
  - 作用：bs 横轴坐标。

### y
  - 类型：Number
  - 作用：bs 纵轴坐标。

### maxScrollX
  - 类型：Number
  - 作用：bs 最大横向滚动位置。
  - 备注：bs 横向滚动的位置区间是 minScrollX - maxScrollX，并且 maxScrollX 是负值。

### maxScrollY
  - 类型：Number
  - 作用：bs 最大纵向滚动位置。
  - 备注：bs 纵向滚动的位置区间是 minScrollY - maxScrollY，并且 maxScrollY 是负值。

### movingDirectionX
  - 类型：Number
  - 作用：判断 bs 滑动过程中的方向（左右）。
  - 备注：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。

### movingDirectionY
  - 类型：Number
  - 作用：判断 bs 滑动过程中的方向（上下）。
  - 备注：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。

### directionX
  - 类型：Number
  - 作用：判断 bs 滑动结束后相对于开始滑动位置的方向（左右）。
  - 备注：-1 表示手指从左向右滑，1 表示从右向左滑，0 表示没有滑动。

### directionY
  - 类型：Number
  - 作用：判断 bs 滑动结束后相对于开始滑动位置的方向（上下）。
  - 备注：-1 表示手指从上往下滑，1 表示从下往上滑，0 表示没有滑动。

### enabled
  - 类型：Boolean,
  - 作用：判断当前 bs 是否处于启用状态。

### pending
  - 类型：Boolean,
  - 作用：判断当前 bs 是否处于滚动动画过程中。

## 方法

BetterScroll 提供了很多灵活的 API，当我们基于 BetterScroll 去实现一些 feature 的时候，会用到这些 API，了解它们会有助于开发更加复杂的需求。

### refresh()
  - 参数：无
  - 返回值：无
  - 作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。

### scrollTo(x, y, time, easing, extraTransform, isSilent)
   - 参数：
     - {Number} x 横轴坐标（单位 px）
     - {Number} y 纵轴坐标（单位 px）
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
     - 只有在你想要修改 CSS transform 的一些其他属性的时候，你才需要传入此参数，结构如下：
     ```js
     let extraTransform = {
       // 起点的属性
       start: {
         scale: 0
       },
       // 终点的属性
       end: {
         scale: 1.1
       }
     }
     ```
     - {boolean} isSilent，在 time 为 0 的时候，是否要派发 scroll 和 scrollEnd 事件。isSilent 为 true，则不派发。
   - 返回值：无
   - 作用：滚动到指定的位置。

### scrollBy(x, y, time, easing)
   - 参数：
     - {Number} x 横轴变化量（单位 px）
     - {Number} y 纵轴变化量（单位 px）
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
   - 返回值：无
   - 作用：相对于当前位置偏移滚动 x,y 的距离。

### scrollToElement(el, time, offsetX, offsetY, easing)
   - 参数：
     - {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 `packages/shared-utils/src/ease.ts` 里的写法
   - 返回值：无
   - 作用：滚动到指定的目标元素。

### stop()
   - 参数：无
   - 返回值：无
   - 作用：立即停止当前运行的滚动动画。

### enable()
   - 参数：无
   - 返回值：无
   - 作用：启用 BetterScroll, 默认 开启。

### disable()
   - 参数：无
   - 返回值：无
   - 作用：禁用 BetterScroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。

### destroy()
   - 参数：无
   - 返回值：无
   - 作用：销毁 BetterScroll，解绑事件。

### on(type, fn, context)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
     - {context} 函数执行的上下文环境，默认是 this
   - 返回值：无
   - 作用：监听当前实例上的钩子函数。如：scroll、scrollEnd 等。
   - 示例：
   ```javascript
   import BScroll from '@better-scroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function onScroll(pos) {
       console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
   }
   scroll.on('scroll', onScroll)
   ```

### once(type, fn, context)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
     - {context} 函数执行的上下文环境，默认是 this
   - 返回值：无
   - 作用：监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

### off(type, fn)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
   - 返回值：无
   - 作用：移除自定义事件监听器。只会移除这个回调的监听器。
   - 示例：
   ```javascript
   import BScroll from '@better-scroll/core'
   let scroll = new BScroll('.wrapper', {
     probeType: 3
   })
   function handler() {
       console.log('bs is scrolling now')
   }
   scroll.on('scroll', handler)

   scroll.off('scroll', handler)
   ```

## 钩子

BetterScroll 除了提供了丰富的 API 调用，还提供了一些事件，方便和外部做交互。你可以利用它们实现一些更高级的 feature。

```js
const bs = new BScroll('.wrapper', {
  probeType: 3
})

bs.on('beforeScrollStart', () => {
  console.log('scrolling is ready to bootstrap')
})
```

### beforeScrollStart
   - 参数：无
   - 触发时机：滚动开始之前。

### scrollStart
   - 参数：无
   - 触发时机：滚动开始时。

### scroll
   - 参数：{Object} {x, y} 滚动的实时坐标
   - 触发时机：滚动过程中。

### scrollCancel
   - 参数：无
   - 触发时机：滚动被取消。比如你强制让一个正在滚动的 bs 停住。

### scrollEnd
   - 参数：{Object} {x, y} 滚动结束的位置坐标
   - 触发时机：滚动结束。

### touchEnd
   - 参数：{Object} {x, y} 位置坐标
   - 触发时机：鼠标/手指离开。

### flick
   - 参数：无
   - 触发时机：轻拂时。

### refresh
   - 参数: 无
   - 触发时机：refresh 方法调用完成后。

### disable
   - 参数: 无
   - 触发时机：bs 被禁用，即不再响应 DOM 事件（touchstart、touchmove、touchend...）。

### enable
   - 参数: 无
   - 触发时机：bs 激活，再次响应 DOM 事件（touchstart、touchmove、touchend...）。

### destroy
   - 参数：无
   - 触发时机：destroy 方法调用完成后。
