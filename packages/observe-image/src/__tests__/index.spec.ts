import BScroll from '@better-scroll/core'
import ObserveImage from '../index'
import { createEvent } from '@better-scroll/core/src/__tests__/__utils__/event'

jest.mock('@better-scroll/core')

const createObserveImageElements = () => {
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  wrapper.appendChild(content)
  return { wrapper, content }
}

describe('observe image', () => {
  const { wrapper, content } = createObserveImageElements()
  let scroll: BScroll
  let observeImage: ObserveImage

  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    scroll = new BScroll(wrapper, {})
    observeImage = new ObserveImage(scroll)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should capture image load or error event', () => {
    let img = document.createElement('img')
    let loadEvent = createEvent('Event', 'load')
    content.appendChild(img)
    img.dispatchEvent(loadEvent)
    jest.advanceTimersByTime(151)
    expect(scroll.refresh).toBeCalled()
  })

  it('should trigger bs.refresh in a tick when debounceTime is 0', () => {
    observeImage.options.debounceTime = 0
    let img = document.createElement('img')
    let loadEvent = createEvent('Event', 'load')
    content.appendChild(img)
    img.dispatchEvent(loadEvent)
    expect(scroll.refresh).toBeCalled()
  })
})
