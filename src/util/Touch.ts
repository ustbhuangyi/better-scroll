interface TouchList {
  length: number
  [index: number]: Touch
  item: (index: number) => Touch
}

interface Touch {
  identifier: number
  target: EventTarget
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX: number
  pageY: number
}

export interface TouchEvent extends UIEvent {
  touches: TouchList
  targetTouches: TouchList
  changedTouches: TouchList
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  rotation: number
  scale: number
  button: number
  _constructed?: boolean
}
