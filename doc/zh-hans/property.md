# 属性

有时候我们想基于 better-scroll 做一些扩展，需要对 better-scroll 的一些属性有所了解，下面介绍几个常用属性。

## x
  - 类型：Number
  - 作用：scroll 横轴坐标。
  
## y
  - 类型：Number
  - 作用：scroll 纵轴坐标。
  
## maxScrollX
  - 类型：Number
  - 作用：scroll 最大横向滚动位置。
  - 备注：scroll 横向滚动的位置区间是 0 - maxScrollX，并且 maxScrollX 是负值。
  
## maxScrollY
  - 类型：Number
  - 作用：scroll 最大纵向滚动位置。
  - 备注：scroll 纵向滚动的位置区间是 0 - maxScrollY，并且 maxScrollY 是负值。
  
## movingDirectionX
  - 类型：Number
  - 作用：判断 scroll 滑动过程中的方向（左右）。
  - 备注：-1 表示从左向右滑，1 表示从右向左滑，0 表示没有滑动。
  
## movingDirectionY
  - 类型：Number
  - 作用：判断 scroll 滑动过程中的方向（上下）。
  - 备注：-1 表示从上往下滑，1 表示从下往上滑，0 表示没有滑动。  
  
## directionX
  - 类型：Number
  - 作用：判断 scroll 滑动结束后相对于开始滑动位置的方向（左右）。
  - 备注：-1 表示从左向右滑，1 表示从右向左滑，0 表示没有滑动。
  
## directionY
  - 类型：Number
  - 作用：判断 scroll 滑动结束后相对于开始滑动位置的方向（上下）。
  - 备注：-1 表示从上往下滑，1 表示从下往上滑，0 表示没有滑动。
  
## enabled
  - 类型：Boolean,
  - 作用：判断当前 scroll 是否处于启用状态。
  
## isInTransition
  - 类型：Boolean,
  - 作用：判断当前 scroll 是否处于滚动动画过程中。
  - 备注：当开启 CSS3 Transition 动画时判断该值。
  
## isAnimating
   - 类型：Boolean,
   - 作用：判断当前 scroll 是否处于滚动动画过程中。
   - 备注：当开启 JS Animation 动画时判断该值。
  