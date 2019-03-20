import { CustomHTMLDivElement } from '../../../utils/layout'

export function createHorizonSlide(childNum: number = 2) {
  const dom = document.createElement('div')
  dom.setAttribute('data-width', '300')
  dom.setAttribute('data-height', '300')
  dom.style.width = '300px'
  dom.style.height = '300px'
  dom.style.overflow = 'hidden'
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
  const dom = document.createElement('div')
  dom.setAttribute('data-width', '300')
  dom.setAttribute('data-height', '300')
  dom.style.width = '300px'
  dom.style.height = '300px'
  dom.style.overflow = 'hidden'
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
  const dom = document.createElement('div')
  dom.setAttribute('data-width', '300')
  dom.setAttribute('data-height', '300')
  dom.style.width = '300px'
  dom.style.height = '300px'
  dom.style.overflow = 'hidden'
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
  const slider = document.createElement('div')
  slider.style.width = `${childNum * 300}px`
  slider.style.height = '100%'
  slider.style.whiteSpace = 'nowrap'
  slider.setAttribute('data-width', `${childNum * 300}`)
  slider.setAttribute('data-height', '300')
  for (let i = 0; i < childNum; i++) {
    slider.appendChild(
      createSlideItem('horizon', { left: `${i * 300}`, top: '0' })
    )
  }
  return slider
}

export function createVerticalSlider(childNum: number = 2) {
  const slider = document.createElement('div')
  slider.style.width = '300px'
  slider.style.height = 'auto'
  slider.style.whiteSpace = 'nowrap'
  slider.setAttribute('data-width', '300')
  slider.setAttribute('data-height', `${childNum * 300}`)
  for (let i = 0; i < childNum; i++) {
    slider.appendChild(
      createSlideItem('vertical', { left: '0', top: `${i * 300}` })
    )
  }
  return slider
}

export function createHorizonVerticalSlider() {
  const slider = document.createElement('div')
  slider.style.width = '600px'
  slider.style.height = '600px'
  slider.setAttribute('data-width', '600')
  slider.setAttribute('data-height', '600')
  slider.appendChild(createSlideItem('horizon', { left: '0', top: '0' }))
  slider.appendChild(createSlideItem('horizon', { left: '0', top: '300' }))
  slider.appendChild(createSlideItem('horizon', { left: '300', top: '0' }))
  slider.appendChild(createSlideItem('horizon', { left: '300', top: '300' }))
  return slider
}

export function createSlideItem(
  direction: 'horizon' | 'vertical',
  pos: { left: string; top: string }
) {
  const sliderItem = document.createElement('div') as CustomHTMLDivElement
  sliderItem.className = 'test-slide-item'
  sliderItem.setAttribute('data-width', '300')
  sliderItem.setAttribute('data-height', '300')
  sliderItem.setAttribute('data-left', pos.left)
  sliderItem.setAttribute('data-top', pos.top)
  sliderItem.style.width = '300px'
  sliderItem.style.height = '300px'
  sliderItem._jsdomMockClientWidth = 300
  sliderItem._jsdomMockClientWidth = 300
  sliderItem.style.display = direction === 'horizon' ? 'inline-block' : 'block'
  return sliderItem
}
