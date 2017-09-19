# Property

When you want to extend based on better-scroll, there are several properties you may need to understand.

## x
  - Type: `Number`.
  - Usage: scroll horizontal axis coordinate.

## y
  - Type: `Number`.
  - Usage: scroll vertical axis coordinate.

## maxScrollX
  - Type: `Number`.
  - Usage: max scrollable horizontal coordinate.
  - Note: horizontal scroll range is [0, maxScrollX], and maxScrollX is negative value.

## maxScrollY
  - Type: `Number`.
  - Usage: max scrollable vertical coordinate could scroll.
  - Note: vertical scroll range is [0, maxScrollY], and maxScrollY is negative value.

## movingDirectionX
  - Type: `Number`.
  - Usage: estimate the moving direction on horizontal is left or right.
  - Note: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't moved.

## movingDirectionY
  - Type: `Number`.
  - Usage: estimate the moving direction on vertical is up or down during scrolling.
  - Note: -1 means from up to down, 1 means from down to up, 0 means haven't moved.

## directionX
  - Type: `Number`.
  - Usage: estimate the moving direction on horizontal between start position and end position is left or right.
  - Note: -1 means moving from left to right, 1 means moving from right to left, 0 means haven't moved.

## directionY
  - Type: `Number`.
  - Usage: estimate the moving direction on vertical between start position and end position is up or down.
  - Note: -1 means from up to down, 1 means from down to up, 0 means haven't moved.

## enabled
  - Type: `Boolean`.
  - Usage: estimate whether the current scroll is enabled.

## isInTransition
  - Type: `Boolean`.
  - Usage: estimate whether the current scroll is in transition.
  - Note: use this property when CSS3 Transition is enabled.

## isAnimating
   - Type: `Boolean`.
   - Usage: estimate whether the current scroll is animating.
   - Note: use this property when JS Animation is enabled.
