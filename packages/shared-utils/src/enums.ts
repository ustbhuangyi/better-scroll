export const enum DirectionLock {
  Default = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  None = 'none'
}

export const enum Direction {
  Positive = 1, // bottom to top and right to left
  Negative = -1, // top to bottom and left to right
  Default = 0
}

export const enum ApplyOrder {
  Pre = 'pre',
  Post = 'post'
}

export const enum EventPassthrough {
  None = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export const enum EventType {
  Touch = 1,
  Mouse = 2
}

export const enum MouseButton {
  Left,
  Middle,
  Right
}

export const enum Probe {
  Default,
  Throttle,
  Normal,
  Realtime
}
