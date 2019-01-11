export enum Probe {
  Throttle = 1,
  Normal,
  Realtime
}

export enum Direction {
  Up = 1,
  Left = 1,
  Down = -1,
  Right = -1
}

export enum EventType {
  Touch = 1,
  Mouse = 2
}

export enum DirectionLock {
  Initial,
  Horizontal,
  Vertical,
  None
}
