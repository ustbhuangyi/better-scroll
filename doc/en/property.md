# Property

When you want to extend on better-scroll, there are several properties you may need to understand.

## x
  - Type: Number.
  - Usage: scroll horizontal axis coordinate.

## y
  - Type: Number.
  - Usage: scroll vertical axis coordinate.

## maxScrollX
  - Type: Number.
  - Usage: max scrollable horizontal coordinate.
  - Remark: horizontal scroll range is [0, maxScrollX], and maxScrollX is negative value.

## maxScrollY
  - Type: Number.
  - Usage: max scrollable vertical coordinate could scroll.
  - Remark: vertical scroll range is [0, maxScrollY], and maxScrollY is negative value.

## movingDirectionX
  - Type: Number.
  - Usage: estimate the moving direction on horizontal is left or right.
  - Remark: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't move.

## movingDirectionY
  - Type: Number.
  - Usage: estimate the moving direction on vertical is up or down during scrolling.
  - Remark: -1 means down, 1 means down, 0 means haven't move.

## directionX
  - Type: Number.
  - Usage: estimate the moving direction on horizontal between start position and end position is left or right.
  - Remark: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't move.

## directionY
  - Type: Number.
  - Usage: estimate the moving direction on vertical between start position and end position is up or down.
  - Remark: -1 means down, 1 means down, 0 means haven't move.

## enabled
  - Type: Boolean.
  - Usage: estimate whether the current scroll is enable.

## isInTransition
  - Type: Boolean.
  - Usage: estimate whether the current scroll is in transition.
  - Remark: use this property when CSS3 Transition is enable.

## isAnimating
   - Type: Boolean.
   - Usage: estimate whether the current scroll is animating.
   - Remark: use this property when JS Animation is enable.
