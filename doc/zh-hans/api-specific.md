# 方法 / 定制

better-scroll 还提供了一些定制的方法，专门用来实现某一个 feature 所用。

## goToPage(x, y, time, easing)
   - 参数
     - {Number} x 横轴的页数
     - {Number} y 纵轴的页数
     - {Number} time 动画执行的时间
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无
   - 作用：当我们做 slide 组件的时候，slide 通常会分成多个页面。调用此方法可以滚动到指定的页面。   
 
## next(time, easing)
   - 参数：
     - {Number} time 动画执行的时间
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无
   - 作用：滚动到下一个页面

## prev(time, easing)
   - 参数：
     - {Number} time 动画执行的时间
     - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
   - 返回值：无
   - 作用：滚动到上一个页面

## getCurrentPage()
   - 参数：无
   - 返回值：{Object} `{ x: posX, y: posY,pageX: x, pageY: y}` 其中，x 和 y 表示偏移的坐标值，pageX 和 pageY 表示横轴方向和纵轴方向的页面数。
   - 作用：获取当前页面的信息。
   
## wheelTo(index)
   - 参数：
     - {Number} index 索引值
   - 返回值：无
   - 作用：当我们做 picker 组件的时候，调用该方法可以滚动到索引对应的位置。
   
## getSelectedIndex() 
   - 参数：无
   - 返回值：{Number} 当前选中的索引值。
   - 作用：获取当前选中的索引值。
   
## finishPullDown()
   - 参数：无
   - 返回值：无
   - 作用：当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。

## finishPullUp() 
   - 参数：无
   - 返回值：无
   - 作用：当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。

## on()
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
   - 返回值：无
   - 作用：监听当前实例上的自定义事件。
   
## once()
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
   - 返回值：无
   - 作用：监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

## off()
   - 参数：
     - {String} type 事件名
     - {Function} fn 回调函数
   - 返回值：无
   - 作用：移除自定义事件监听器。只会移除这个回调的监听器。
   - 示例：
   ```javascript
   function onPullingUp() {
     console.log('pullingup success!')
   }
   BScroll.on('pullingUp', onPullingUp)
   BScroll.off('pullingUp', onPullingUp) 
   ```
