export enum Probe {
  Default,
  Throttle,
  Normal,
  Realtime
}

export enum Direction {
  Positive = 1, // top and left
  Negative = -1, // down and right
  Default = 0
}

export enum EventType {
  Touch = 1,
  Mouse = 2
}

export enum DirectionLock {
  Default = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  None = 'none'
}

export enum MouseButton {
  Left,
  Middle,
  Right
}

export enum EventPassthrough {
  None = '',
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}
