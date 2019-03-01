import { style, extend } from '../util'
import Base, { TransformPoint } from './Base'
import { safeCSSStyleDeclaration } from '../util'

interface Options {
  translateZ: string
}
interface TransformMap {
  x: Array<string>
  y: Array<string>
  scale: Array<string>
  [key: string]: any
}
const translateMap: TransformMap = {
  x: ['translateX', 'px'],
  y: ['translateY', 'px'],
  scale: ['scale', '']
}

export default class Transform extends Base {
  options: Options
  private lastPoint: TransformPoint
  private remainDiff = true
  constructor(element: HTMLElement, options: Options) {
    super(element)
    this.options = options
  }

  getComputedPosition() {
    let cssStyle = window.getComputedStyle(
      this.element,
      null
    ) as safeCSSStyleDeclaration
    let matrix = cssStyle[style.transform].split(')')[0].split(', ')
    const x = +(matrix[12] || matrix[4])
    const y = +(matrix[13] || matrix[5])

    return {
      x,
      y
    }
  }

  translate(point: TransformPoint) {
    let _point: TransformPoint
    if (this.remainDiff) {
      _point = extend({}, this.lastPoint, point) as TransformPoint
    } else {
      _point = extend({}, point) as TransformPoint
    }
    this.lastPoint = _point as TransformPoint
    let transformStyle = [] as string[]
    Object.keys(_point).forEach(key => {
      if (translateMap[key][0]) {
        transformStyle.push(
          `${translateMap[key][0]}(${_point[key]}${translateMap[key][1]})`
        )
      }
    })
    transformStyle.push(this.options.translateZ)
    this.style[style.transform as any] = `${transformStyle.join(' ')}`
  }
}
