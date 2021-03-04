import { inBrowser, isWeChatDevTools, supportsPassive } from './env'
import { extend } from './lang'

export type safeCSSStyleDeclaration = {
  [key: string]: string
} & CSSStyleDeclaration
export interface DOMRect {
  left: number
  top: number
  width: number
  height: number
  [key: string]: number
}

let elementStyle = (inBrowser &&
  document.createElement('div').style) as safeCSSStyleDeclaration

let vendor = (() => {
  /* istanbul ignore if  */
  if (!inBrowser) {
    return false
  }
  const transformNames = [
    {
      key: 'standard',
      value: 'transform',
    },
    {
      key: 'webkit',
      value: 'webkitTransform',
    },
    {
      key: 'Moz',
      value: 'MozTransform',
    },
    {
      key: 'O',
      value: 'OTransform',
    },
    {
      key: 'ms',
      value: 'msTransform',
    },
  ]
  for (let obj of transformNames) {
    if (elementStyle[obj.value] !== undefined) {
      return obj.key
    }
  }
  /* istanbul ignore next  */
  return false
})()

/* istanbul ignore next  */
function prefixStyle(style: string): string {
  if (vendor === false) {
    return style
  }

  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getElement(el: HTMLElement | string) {
  return (typeof el === 'string'
    ? document.querySelector(el)
    : el) as HTMLElement
}

export function addEvent(
  el: HTMLElement,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: AddEventListenerOptions
) {
  const useCapture = supportsPassive
    ? {
        passive: false,
        capture: !!capture,
      }
    : !!capture
  el.addEventListener(type, fn, useCapture)
}

export function removeEvent(
  el: HTMLElement,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: EventListenerOptions
) {
  el.removeEventListener(type, fn, {
    capture: !!capture,
  })
}

export function offset(el: HTMLElement | null) {
  let left = 0
  let top = 0

  while (el) {
    left -= el.offsetLeft
    top -= el.offsetTop
    el = el.offsetParent as HTMLElement
  }

  return {
    left,
    top,
  }
}

export function offsetToBody(el: HTMLElement) {
  let rect = el.getBoundingClientRect()

  return {
    left: -(rect.left + window.pageXOffset),
    top: -(rect.top + window.pageYOffset),
  }
}

export const cssVendor =
  vendor && vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : ''

let transform = prefixStyle('transform')
let transition = prefixStyle('transition')

export const hasPerspective =
  inBrowser && prefixStyle('perspective') in elementStyle
// fix issue #361
export const hasTouch =
  inBrowser && ('ontouchstart' in window || isWeChatDevTools)
export const hasTransition = inBrowser && transition in elementStyle

export const style = {
  transform,
  transition,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd'),
  transitionProperty: prefixStyle('transitionProperty'),
}

export const eventTypeMap: {
  [key: string]: number
  touchstart: number
  touchmove: number
  touchend: number
  touchcancel: number
  mousedown: number
  mousemove: number
  mouseup: number
} = {
  touchstart: 1,
  touchmove: 1,
  touchend: 1,
  touchcancel: 1,

  mousedown: 2,
  mousemove: 2,
  mouseup: 2,
}

export function getRect(el: HTMLElement): DOMRect {
  /* istanbul ignore if  */
  if (el instanceof (window as any).SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  }
}

export function preventDefaultExceptionFn(
  el: any,
  exceptions: {
    tagName?: RegExp
    className?: RegExp
    [key: string]: any
  }
) {
  for (let i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true
    }
  }
  return false
}

export const tagExceptionFn = preventDefaultExceptionFn

export function tap(e: any, eventName: string) {
  let ev = document.createEvent('Event') as any
  ev.initEvent(eventName, true, true)
  ev.pageX = e.pageX
  ev.pageY = e.pageY
  e.target.dispatchEvent(ev)
}

export function click(e: any, event = 'click') {
  let eventSource
  if (e.type === 'mouseup') {
    eventSource = e
  } else if (e.type === 'touchend' || e.type === 'touchcancel') {
    eventSource = e.changedTouches[0]
  }
  let posSrc: {
    screenX?: number
    screenY?: number
    clientX?: number
    clientY?: number
  } = {}
  if (eventSource) {
    posSrc.screenX = eventSource.screenX || 0
    posSrc.screenY = eventSource.screenY || 0
    posSrc.clientX = eventSource.clientX || 0
    posSrc.clientY = eventSource.clientY || 0
  }
  let ev: any
  const bubbles = true
  const cancelable = true
  const { ctrlKey, shiftKey, altKey, metaKey } = e
  const pressedKeysMap = {
    ctrlKey,
    shiftKey,
    altKey,
    metaKey,
  }
  if (typeof MouseEvent !== 'undefined') {
    try {
      ev = new MouseEvent(
        event,
        extend(
          {
            bubbles,
            cancelable,
            ...pressedKeysMap,
          },
          posSrc
        )
      )
    } catch (e) {
      /* istanbul ignore next */
      createEvent()
    }
  } else {
    createEvent()
  }

  function createEvent() {
    ev = document.createEvent('Event')
    ev.initEvent(event, bubbles, cancelable)
    extend(ev, posSrc)
  }

  // forwardedTouchEvent set to true in case of the conflict with fastclick
  ev.forwardedTouchEvent = true
  ev._constructed = true
  e.target.dispatchEvent(ev)
}

export function dblclick(e: Event) {
  click(e, 'dblclick')
}

export function prepend(el: HTMLElement, target: HTMLElement) {
  const firstChild = target.firstChild as HTMLElement
  if (firstChild) {
    before(el, firstChild)
  } else {
    target.appendChild(el)
  }
}

export function before(el: HTMLElement, target: HTMLElement) {
  const parentNode = target.parentNode as HTMLElement
  parentNode.insertBefore(el, target)
}

export function removeChild(el: HTMLElement, child: HTMLElement) {
  el.removeChild(child)
}

export function hasClass(el: HTMLElement, className: string) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el: HTMLElement, className: string) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el: HTMLElement, className: string) {
  if (!hasClass(el, className)) {
    return
  }

  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function HTMLCollectionToArray(el: HTMLCollection) {
  return Array.prototype.slice.call(el, 0)
}

export function getClientSize(el: HTMLElement) {
  return {
    width: el.clientWidth,
    height: el.clientHeight,
  }
}
