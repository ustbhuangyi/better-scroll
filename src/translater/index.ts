import { style, extend, safeCSSStyleDeclaration } from '../util'
export interface TranslaterPoint {
  x: number
  y: number
  [key: string]: number
}

interface Options {
  translateZ: string
}
interface TranslaterMetaData {
  x: [string, string]
  y: [string, string]
  scale: [string, string]
  [key: string]: any
}
const translaterMetaData: TranslaterMetaData = {
  x: ['translateX', 'px'],
  y: ['translateY', 'px'],
  scale: ['scale', '']
}

export default class Translater {
  style: CSSStyleDeclaration
  private lastPoint: TranslaterPoint
  private remainDiff = true
  constructor(public element: HTMLElement, public options: Options) {
    this.style = element.style
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

  translate(point: TranslaterPoint) {
    let _point: TranslaterPoint
    if (this.remainDiff) {
      _point = extend({}, this.lastPoint, point) as TranslaterPoint
    } else {
      _point = extend({}, point) as TranslaterPoint
    }
    this.lastPoint = _point as TranslaterPoint
    let transformStyle = [] as string[]
    Object.keys(_point).forEach(key => {
      if (translaterMetaData[key][0]) {
        transformStyle.push(
          `${translaterMetaData[key][0]}(${_point[key]}${
            translaterMetaData[key][1]
          })`
        )
      }
    })
    transformStyle.push(this.options.translateZ)
    this.style[style.transform as any] = `${transformStyle.join(' ')}`
  }
}
