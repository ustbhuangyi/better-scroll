# 方法 / 通用

better-scroll 提供了很多灵活的 API，当我们基于 better-scroll 去实现一些 feature 的时候，会用到这些 API，了解他们会有助于开发更加复杂的需求。

## refresh()
  - 参数：无
  - 返回值：无  
  - 作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。

## scrollTo(x, y, time, easing)
   - 参数：
     - {Number} x 横轴坐标（单位 px）
     - {Number} y 纵轴坐标（单位 px）
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无  
   - 作用：滚动到指定的位置，见 [Demo](https://ustbhuangyi.github.io/better-scroll/#/examples/vertical-scroll/zh) 。  

## scrollBy(x, y, time, easing)
   - 参数：
     - {Number} x 横轴距离（单位 px）
     - {Number} y 纵轴距离（单位 px）
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无  
   - 作用：相对于当前位置偏移滚动 x,y 的距离。
   
## scrollToElement(el, time, offsetX, offsetY, easing)
   - 参数：
     - {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
     - {Number} time 滚动动画执行的时长（单位 ms）
     - {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无  
   - 作用：滚动到指定的目标元素。

## stop()
   - 参数：无
   - 返回值：无
   - 作用：立即停止当前运行的滚动动画。
   
## enable()
   - 参数：无
   - 返回值：无
   - 作用：启用 better-scroll, 默认 开启。

## disable()
   - 参数：无
   - 返回值：无
   - 作用：禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
   
## destroy()
   - 参数：无
   - 返回值：无
   - 作用：销毁 better-scroll，解绑事件。
   
## on(type, fn, context)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
     - {context} 函数执行的上下文环境，默认是 this
   - 返回值：无
   - 作用：监听当前实例上的[自定义事件](/events.html)。如：scroll, scrollEnd, pullingUp, pullingDown等。
   - 示例：
   ```javascript
   import BScroll from 'better-scroll'
   let scroll = new BScroll('.wrapper')
   function onScroll(pos) {
       console.log(`Now position is x: ${pos.x}, y: ${pos.y}`)
   }
   scroll.on('scroll', onScroll)
   ```
   
## once(type, fn, context)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
     - {context} 函数执行的上下文环境，默认是 this
   - 返回值：无
   - 作用：监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

## off(type, fn)
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
   - 返回值：无
   - 作用：移除自定义事件监听器。只会移除这个回调的监听器。
   - 示例：
   ```javascript
   import BScroll from 'better-scroll'
   let scroll = new BScroll('.wrapper', {
       pullUpLoad: true
   })
   function onPullingUp() {
       console.log('pullingup success!')
   }
   scroll.on('pullingUp', onPullingUp) // 添加pullingup事件回调onPullingUp
   ...
   scroll.off('pullingUp', onPullingUp) // 移除pullingup事件回调onPullingUp
   ...
   ```   