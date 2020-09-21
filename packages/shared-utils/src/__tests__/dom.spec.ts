import {
  prepend,
  removeChild,
  addClass,
  removeClass,
  tap,
  dblclick,
  click,
} from '../dom'

describe('dom', () => {
  it('prepend', () => {
    // append operation
    const target1 = document.createElement('div')
    const el1 = document.createElement('p')
    prepend(el1, target1)

    expect(target1.children[0]).toBe(el1)

    // prepend operation
    const target2 = document.createElement('div')
    const child = document.createElement('div')
    target2.appendChild(child)
    const el2 = document.createElement('p')
    prepend(el2, target2)

    expect(target2.children[0]).toBe(el2)
    expect(target2.children[1]).toBe(child)
  })

  it('removeChild', () => {
    // append operation
    const target = document.createElement('div')
    const el = document.createElement('p')
    prepend(el, target)

    expect(target.children[0]).toBe(el)

    removeChild(target, el)
    expect(target.children.length).toBe(0)
  })

  it('addClass & removeClass', () => {
    const target = document.createElement('div')
    addClass(target, 'test')
    expect(target.className).toBe(' test')

    // same classname
    addClass(target, 'test')

    addClass(target, 'test2')
    expect(target.className).toBe(' test test2')

    // exclude unexisted classname
    removeClass(target, 'biz')
    expect(target.className).toBe(' test test2')

    removeClass(target, 'test test2')
    expect(target.className).toBe(' ')
  })

  it('tap & dblclick', () => {
    const mockFn1 = jest.fn()
    const mockFn2 = jest.fn()
    const target = document.createElement('div')
    document.body.appendChild(target)

    let e = { target } as any
    window.addEventListener('tap', mockFn1)
    window.addEventListener('dblclick', mockFn2)
    tap(e, 'tap')
    expect(mockFn1).toBeCalled()

    dblclick(e)
    expect(mockFn2).toBeCalled()
  })

  it('click ', () => {
    const mockFn1 = jest.fn()
    const target = document.createElement('div')
    document.body.appendChild(target)

    let e = { target, type: 'mouseup' } as any
    window.addEventListener('click', mockFn1)
    click(e)

    expect(mockFn1).toBeCalled()

    // fallback to createEvent
    Object.defineProperty(window, 'MouseEvent', {
      get() {
        return undefined
      },
    })
    click(Object.assign(e, { type: 'touchend', changedTouches: [{}] }))
    expect(mockFn1).toBeCalledTimes(2)
  })
})
