export function createEvent(type: string, name: string): Event {
  const e = document.createEvent(type || 'Event')
  e.initEvent(name, true, true)
  return e
}

interface CustomTouch {
  pageX: number
  pageY: number
}
type CustomTouches = CustomTouch[] | CustomTouch

export interface CustomTouchEvent extends Event {
  touches: CustomTouches
  targetTouches: CustomTouches
  changedTouches: CustomTouches
}

interface CustomMouseEvent extends Event {
  button: 0
}

export function dispatchTouch(
  target: EventTarget,
  name = 'touchstart',
  touches: CustomTouches
): void {
  const event = <CustomTouchEvent>createEvent('', name)
  event.touches = event.targetTouches = event.changedTouches = touches
  target.dispatchEvent(event)
}

export function dispatchMouse(target: EventTarget, name = 'mousedown'): void {
  const event = <CustomMouseEvent>createEvent('', name)
  event.button = 0
  target.dispatchEvent(event)
}

export function dispatchTouchStart(
  target: EventTarget,
  touches: CustomTouches
): void {
  dispatchTouch(target, 'touchstart', touches)
}

export function dispatchTouchMove(
  target: EventTarget,
  touches: CustomTouches
): void {
  dispatchTouch(target, 'touchmove', touches)
}

export function dispatchTouchEnd(
  target: EventTarget,
  touches: CustomTouches
): void {
  dispatchTouch(target, 'touchend', touches)
}

export function dispatchSwipe(
  target: EventTarget,
  touches: CustomTouches,
  duration: number,
  cb: () => any
): void {
  // TODO 优化写法
  if (!Array.isArray(touches)) {
    touches = [touches]
  }
  if (touches instanceof Array) {
    dispatchTouchStart(target, touches[0])
    const moveAndEnd = () => {
      if (touches instanceof Array) {
        dispatchTouchMove(target, touches[1] || touches[0])
        dispatchTouchEnd(target, touches[2] || touches[1] || touches[0])
      }
      cb && cb()
    }
    if (duration) {
      setTimeout(moveAndEnd, duration)
    } else {
      moveAndEnd()
    }
  }
}
