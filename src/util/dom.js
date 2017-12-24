import { isWeChatDevTools } from './env'
import { extend } from './lang'

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, {passive: false, capture: !!capture})
}

export function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, {passive: false, capture: !!capture})
}

export function offset(el) {
  let left = 0
  let top = 0

  while (el) {
    left -= el.offsetLeft
    top -= el.offsetTop
    el = el.offsetParent
  }

  return {
    left,
    top
  }
}

let transform = prefixStyle('transform')

export const hasPerspective = prefixStyle('perspective') in elementStyle
// fix issue #361
export const hasTouch = 'ontouchstart' in window || isWeChatDevTools
export const hasTransform = transform !== false
export const hasTransition = prefixStyle('transition') in elementStyle

export const style = {
  transform,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionProperty: prefixStyle('transitionProperty'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
}

export const TOUCH_EVENT = 1
export const MOUSE_EVENT = 2

export const eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    var rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

export function preventDefaultException(el, exceptions) {
  for (let i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true
    }
  }
  return false
}

export function tap(e, eventName) {
  let ev = document.createEvent('Event')
  ev.initEvent(eventName, true, true)
  ev.pageX = e.pageX
  ev.pageY = e.pageY
  e.target.dispatchEvent(ev)
}

export function click(e) {
  let target = e.target

  if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
    let eventSource
    if (e.type === 'mouseup' || e.type === 'mousecancel') {
      eventSource = e
    } else if (e.type === 'touchend' || e.type === 'touchcancel') {
      eventSource = e.changedTouches[0]
    }
    let posSrc = {}
    if (eventSource) {
      posSrc.screenX = eventSource.screenX || 0
      posSrc.screenY = eventSource.screenY || 0
      posSrc.clientX = eventSource.clientX || 0
      posSrc.clientY = eventSource.clientY || 0
    }
    let ev
    const event = 'click'
    const bubbles = true
    // cancelable set to false in case of the conflict with fastclick
    const cancelable = false
    if (typeof MouseEvent !== 'undefined') {
      ev = new MouseEvent(event, extend({
        bubbles,
        cancelable
      }, posSrc))
    } else {
      ev = document.createEvent('Event')
      ev.initEvent(event, bubbles, cancelable)
      extend(ev, posSrc)
    }
    ev._constructed = true
    target.dispatchEvent(ev)
  }
}

export function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

export function before(el, target) {
  target.parentNode.insertBefore(el, target)
}

export function removeChild(el, child) {
  el.removeChild(child)
}