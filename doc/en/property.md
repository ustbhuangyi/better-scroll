# Property

When you want to extend on BetterScroll, there are several properties you may need to understand.

## x
  - type: Number
  - usage: scroll horizontal axis coordinate.

## y
  - type: Number
  - usage: scroll vertical axis coordinate.

## maxScrollX
  - type: Number
  - usage: max scrollable horizontal coordinate.
  - remark: horizontal scroll range is [0, maxScrollX], and maxScrollX is negative value.

## maxScrollY
  - type: Number
  - usage: max scrollable vertical coordinate could scroll.
  - remark: vertical scroll range is [0, maxScrollY], and maxScrollY is negative value.

## movingDirectionX
  - type: Number
  - usage: estimate the moving direction on horizontal is left or right.
  - remark: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't move.

## movingDirectionY
  - type: Number
  - usage: estimate the moving direction on vertical is up or down during scrolling.
  - remark: -1 means down, 1 means down, 0 means haven't move.

## directionX
  - type: Number
  - usage: estimate the moving direction on horizontal between start position and end position is left or right.
  - remark: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't move.

## directionY
  - type: Number
  - usage: estimate the moving direction on vertical between start position and end position is up or down.
  - remark: -1 means down, 1 means down, 0 means haven't move.

## enabled
  - type: Boolean,
  - usage: estimate whether the current scroll is enable.

## isInTransition
  - type: Boolean,
  - usage: estimate whether the current scroll is in transition.
  - remark: use this property when CSS3 Transition is enable.

## isAnimating
   - type: Boolean,
   - usage: estimate whether the current scroll is animating.
   - remark: use this property when JS Animation is enable.
