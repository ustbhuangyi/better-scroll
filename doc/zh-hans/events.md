# 事件

better-scroll 除了提供了丰富的 API 调用，还提供了一些事件，方便和外部做交互。你可以利用他们实现一些更高级的 feature。

## beforeScrollStart
   - 参数：无
   - 触发时机：滚动开始之前。
   
## scrollStart
   - 参数：无
   - 触发时机：滚动开始时。
  
## scroll
   - 参数：{Object} {x, y} 滚动的实时坐标
   - 触发时机：滚动过程中，具体时机取决于选项中的 [probeType](/options.html#probetype)。
   
## scrollCancel
   - 参数：无
   - 触发时机：滚动被取消。
   
## scrollEnd
   - 参数：{Object} {x, y} 滚动结束的位置坐标
   - 触发时机：滚动结束。
   
## touchEnd
   - 参数：{Object} {x, y} 位置坐标
   - 触发时机：鼠标/手指离开。
   
## flick
   - 参数：无
   - 触发时机：轻拂时。
   
## refresh
   - 参数: 无
   - 触发时机：refresh 方法调用完成后。
   
## destroy
   - 参数：无
   - 触发时机：destroy 方法调用完成后。
   
## pullingDown
   - 参数：无
   - 触发时机：在一次下拉刷新的动作后，这个时机一般用来去后端请求数据。
   
## pullingUp
   - 参数：无
   - 触发时机：在一次上拉加载的动作后，这个时机一般用来去后端请求数据。
      
   
 
   
   
   