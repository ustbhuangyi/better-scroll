import {
  style,
  safeCSSStyleDeclaration,
  EventEmitter
} from '@better-scroll/shared-utils'
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
  [key: string]: any
}
const translaterMetaData: TranslaterMetaData = {
  x: ['translateX', 'px'],
  y: ['translateY', 'px']
}

export default class Translater {
  style: CSSStyleDeclaration
  hooks: EventEmitter
  constructor(public content: HTMLElement) {
    this.style = content.style
    this.hooks = new EventEmitter(['beforeTranslate', 'translate'])
  }

  getComputedPosition() {
    let cssStyle = window.getComputedStyle(
      this.content,
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
    let transformStyle = [] as string[]
    Object.keys(point).forEach(key => {
      if (!translaterMetaData[key]) {
        return
      }
      const transformFnName = translaterMetaData[key][0]
      if (transformFnName) {
        const transformFnArgUnit = translaterMetaData[key][1]
        const transformFnArg = point[key]
        transformStyle.push(
          `${transformFnName}(${transformFnArg}${transformFnArgUnit})`
        )
      }
    })
    this.hooks.trigger(
      this.hooks.eventTypes.beforeTranslate,
      transformStyle,
      point
    )
    this.style[style.transform as any] = transformStyle.join(' ')
    this.hooks.trigger(this.hooks.eventTypes.translate, point)
  }

  destroy() {
    this.hooks.destroy()
  }
}
