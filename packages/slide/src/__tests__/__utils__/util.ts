import { createDiv } from '@better-scroll/core/src/__tests__/__utils__/layout'

export function createHorizonSlide(childNum: number = 2) {
  const dom = createDiv(300, 300)
  const slider = createHorizonSlider(childNum)
  dom.appendChild(slider)
  return {
    dom,
    slider,
    domStyle: {
      width: 300,
      height: 300
    },
    sliderStyle: {
      width: 600,
      height: 300
    }
  }
}
export function createVerticalSlide(childNum: number = 2) {
  const dom = createDiv(300, 300)
  const slider = createVerticalSlider(childNum)
  dom.appendChild(slider)
  return {
    dom,
    slider,
    domStyle: {
      width: 300,
      height: 300
    },
    sliderStyle: {
      width: 300,
      height: 600
    }
  }
}
export function createHorizonVerticalSlide() {
  const dom = createDiv(300, 300)
  const slider = createHorizonVerticalSlider()
  dom.appendChild(slider)
  return {
    dom,
    slider,
    domStyle: {
      width: 300,
      height: 300
    },
    sliderStyle: {
      width: 600,
      height: 600
    }
  }
}
export function createHorizonSlider(childNum: number = 2) {
  const slider = createDiv(300 * childNum, 300)
  for (let i = 0; i < childNum; i++) {
    slider.appendChild(createSlideItem('horizon', { left: i * 300, top: 0 }))
  }
  return slider
}

export function createVerticalSlider(childNum: number = 2) {
  const slider = createDiv(300, childNum * 300)
  for (let i = 0; i < childNum; i++) {
    slider.appendChild(createSlideItem('vertical', { left: 0, top: i * 300 }))
  }
  return slider
}

export function createHorizonVerticalSlider() {
  const slider = createDiv(600, 600)
  slider.appendChild(createSlideItem('horizon', { left: 0, top: 0 }))
  slider.appendChild(createSlideItem('horizon', { left: 0, top: 300 }))
  slider.appendChild(createSlideItem('horizon', { left: 300, top: 0 }))
  slider.appendChild(createSlideItem('horizon', { left: 300, top: 300 }))
  return slider
}

export function createSlideItem(
  direction: 'horizon' | 'vertical',
  pos: { left: number; top: number }
) {
  const sliderItem = createDiv(300, 300, pos.top, pos.left)
  sliderItem.className = 'test-slide-item'
  return sliderItem
}
