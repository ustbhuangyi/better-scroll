import BScroll from '../../../../src/index'
import Wheel from '../../../../src/plugins/wheel'
BScroll.use(Wheel)

// jest.mock('../../../../src/index')
describe('wheel plugin tests', () => {
  let wheels: BScroll[] = []
  let wrapper: HTMLElement | null

  beforeEach(() => {
    wrapper = document.createElement('div') as HTMLElement
    ;(wrapper as any).__mockOffsetHeight = '100'
    wrapper.className = 'wheel-wrapper'
    const listArr = []
    document.body.appendChild(wrapper)

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: function() {
        return this.__mockOffsetHeight || 0
      }
    })
    for (let i = 0; i < 3; i++) {
      let ulHTML = ''
      const ul = document.createElement('ul')
      ul.className = 'wheel-scroll'
      ;(ul as any).__mockOffsetHeight = 1000

      const scroller = document.createElement('div')
      scroller.className = 'wheel'
      ;(scroller as any).__mockOffsetHeight = 100

      for (let i = 0; i < 10; i++) {
        if (i === 0) {
          ulHTML += `<li class="wheel-item wheel-disabled-item">${i}</li>`
        } else {
          ulHTML += `<li class="wheel-item">${i}</li>`
        }
      }
      ul.innerHTML = ulHTML
      listArr.push(ul)
      scroller.appendChild(ul)
      wrapper.appendChild(scroller)
      wheels[i] = new BScroll(wrapper.children[i] as HTMLElement, {
        wheel: {
          selectedIndex: 0
        },
        probeType: 3
      })
    }
  })

  afterEach(() => {
    wheels = []
    wrapper = null
    document.body.removeChild(document.querySelector(
      '.wheel-wrapper'
    ) as HTMLElement)
  })

  test('the wheel wrapper class name should be use default value', () => {
    const wheel = wheels[0]
    const options = wheel.plugins.wheel.options

    expect(options.wheelWrapperClass).toBe('wheel-scroll')
    expect(options.wheelItemClass).toBe('wheel-item')
    expect(options.wheelDisabledItemClass).toBe('wheel-disabled-item')
    expect(wheel.plugins.wheel.selectedIndex).toBe(0)
  })

  test('wheelTo', () => {
    const wheel = wheels[0]

    wheel.wheelTo(4)
    expect(wheel.getSelectedIndex()).toBe(4)
  })
})
