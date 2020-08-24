import { Behavior } from '../Behavior'
import { createDiv } from '../../__tests__/__utils__/layout'

describe('Behavior Class tests', () => {
  let behavior: Behavior
  let content: HTMLElement
  let wrapper: HTMLElement
  let options = {
    movable: false,
    scrollable: true,
    momentum: true,
    momentumLimitTime: 300,
    momentumLimitDistance: 15,
    deceleration: 0.001,
    swipeBounceTime: 2500,
    outOfBoundaryDampingFactor: 1 / 3,
    swipeTime: 2000,
    bounces: [true, true] as [boolean, boolean],
    rect: {
      size: 'height',
      position: 'top',
    },
  }
  beforeEach(() => {
    wrapper = createDiv(100, 200, 0, 0)
    content = createDiv(100, 400, 0, 0)
    document.body.appendChild(content)
    wrapper.appendChild(content)
    behavior = new Behavior(wrapper, options)
  })

  it('should init hooks when call constructor function', () => {
    expect(behavior.hooks.eventTypes).toHaveProperty('momentum')
    expect(behavior.hooks.eventTypes).toHaveProperty('end')
    expect(behavior.currentPos).toBe(0)
    expect(behavior.startPos).toBe(0)
    expect(behavior.content).toEqual(content)
  })

  it('should refresh some properties when invoking refresh method', () => {
    behavior.refresh()

    expect(behavior.wrapperSize).toBe(200)
    expect(behavior.contentSize).toBe(400)
    expect(behavior.relativeOffset).toBe(0)
    expect(behavior.minScrollPos).toBe(-0)
    expect(behavior.maxScrollPos).toBe(-200)
    expect(behavior.hasScroll).toBe(true)
    expect(behavior.direction).toBe(0)
  })

  it('should refresh some properties when invoking start method', () => {
    behavior.start()
    expect(behavior.direction).toBe(0)
    expect(behavior.movingDirection).toBe(0)
    expect(behavior.dist).toBe(0)
  })

  it('should refresh some properties when invoking move method', () => {
    behavior.refresh()
    expect(behavior.move(-10)).toBe(-10)
    expect(behavior.movingDirection).toBe(1)
  })

  it('should not trigger momentum scroll when duration is exceed momentumLimitTime', () => {
    let endMockHandler = jest.fn()
    behavior.hooks.on('end', endMockHandler)
    behavior.refresh()
    behavior.end(400)
    expect(endMockHandler).toBeCalled()
    expect(endMockHandler).toHaveBeenCalledWith({
      duration: 0,
    })
  })

  it('should trigger momentum scroll', () => {
    behavior.refresh()
    behavior.currentPos = -100

    expect(behavior.end(100)).toEqual({
      destination: -200,
      duration: 2500,
      rate: 15,
    })
  })

  it('should keep direction unchanged when invoking updateDirection method', () => {
    behavior.updateDirection()
    expect(behavior.direction).toBe(0)
  })

  it('should update position when invoking updatePosition method', () => {
    behavior.updatePosition(100)
    expect(behavior.currentPos).toBe(100)
  })

  it('should auto bouncing within boundary when out of boundary', () => {
    behavior.refresh()
    behavior.updatePosition(-400)
    expect(behavior.checkInBoundary()).toEqual({
      position: -200,
      inBoundary: false,
    })
  })
})
