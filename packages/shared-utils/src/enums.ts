export const enum DirectionLock {
  Default = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  None = 'none',
}

export const enum Direction {
  // fingers move from bottom to top or right to left
  Positive = 1,
  // on the contrary as above
  Negative = -1,
  Default = 0,
}

export const enum ApplyOrder {
  Pre = 'pre',
  Post = 'post',
}

export const enum EventPassthrough {
  None = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export const enum EventType {
  Touch = 1,
  Mouse = 2,
}

export const enum MouseButton {
  Left,
  Middle,
  Right,
}

export const enum Probe {
  Default,
  Throttle,
  Normal,
  Realtime,
}

export const enum Quadrant {
  First = 1,
  Second,
  Third,
  Forth,
}
