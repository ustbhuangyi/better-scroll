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

  it('click showdom', () => {
    // test shawdom event
    const target = document.createElement('div')
    const shawdomDiv = document.createElement('div')
    const shadowRoot = shawdomDiv.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(target)
    const shawdomWarpper = document.createElement('div')
    shawdomWarpper.appendChild(shawdomDiv)
    const ListenerDiv = document.createElement('div')
    ListenerDiv.appendChild(shawdomWarpper)
    const mockFn1 = jest.fn((e) => {
      e.stopPropagation()
      e.preventDefault()
      // target not to be target, to be shawdom element
      expect(e.target).toBe(shawdomDiv)
      expect(e.composedPath).toBeDefined()
      // e.composedPath()[0] to be target
      expect(e.composedPath()[0]).toBe(target)
      click(e)
    })
    const mockFn2 = jest.fn((e) => {
      // target not to be target, to be shawdom element
      expect(e.target).toBe(shawdomDiv)
      expect(e.composedPath).toBeDefined()
      // e.composedPath()[0] to be target
      expect(e.composedPath()[0]).toBe(target)
    })

    shawdomWarpper.addEventListener('mouseup', mockFn1)
    ListenerDiv.addEventListener('click', mockFn2)
    const ev = new CustomEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    target.dispatchEvent(ev)
    expect(mockFn1).toBeCalled()
    expect(mockFn2).toBeCalled()
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

    // test shawdom event
    const target2 = document.createElement('div')
    const shawdomDiv = document.createElement('div')
    shawdomDiv.appendChild(target2)
    shawdomDiv.attachShadow({ mode: 'open' })
    const ListenerDiv = document.createElement('div')
    ListenerDiv.appendChild(shawdomDiv)
    ListenerDiv.addEventListener('click', mockFn2)
    let e2 = { target: target2 } as any
    click(e2)
    expect(mockFn2).toBeCalled()
    expect(mockFn1).toBeCalled()
    // fallback to createEvent
    Object.defineProperty(window, 'CustomEvent', {
      get() {
        return undefined
      },
    })
    tap(e, 'tap')
    expect(mockFn1).toBeCalled()

    dblclick(e)
    expect(mockFn2).toBeCalled()
  })

  it('click ', () => {
    const mockFn1 = jest.fn()
    const mockFn2 = jest.fn()
    const target = document.createElement('div')
    document.body.appendChild(target)

    let e = { target, type: 'mouseup' } as any
    window.addEventListener('click', mockFn1)
    click(e)

    expect(mockFn1).toBeCalled()
    // test shawdom event
    const target2 = document.createElement('div')
    const shawdomDiv = document.createElement('div')
    shawdomDiv.appendChild(target2)
    shawdomDiv.attachShadow({ mode: 'open' })
    const ListenerDiv = document.createElement('div')
    ListenerDiv.appendChild(shawdomDiv)
    ListenerDiv.addEventListener('click', mockFn2)
    let e2 = { target: target2, type: 'mouseup' } as any
    click(e2)
    expect(mockFn2).toBeCalled()
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
