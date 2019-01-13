export enum Probe {
  Default,
  Throttle,
  Normal,
  Realtime
}

export enum Direction {
  Up = 1,
  Left = 1,
  Down = -1,
  Right = -1,
  Default = 0
}

export enum EventType {
  Touch = 1,
  Mouse = 2
}

export enum DirectionLock {
  Default,
  Horizontal,
  Vertical,
  None
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
