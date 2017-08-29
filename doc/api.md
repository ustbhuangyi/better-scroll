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
   - 作用：滚动到指定的位置，见 [Demo](https://ustbhuangyi.github.io/better-scroll/demo/#/vertical-scroll) 。  

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