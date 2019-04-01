import EventEmitter from '@/base/EventEmitter'

const Behavior = jest.fn().mockImplementation((content, bscrollOptions) => {
  return {
    content,
    options: bscrollOptions,
    startPos: 0,
    absStartPos: 0,
    dist: 0,
    minScrollPos: 0,
    maxScrollPos: 0,
    hasScroll: true,
    direction: 0,
    movingDirection: 0,
    relativeOffset: 0,
    wrapperSize: 0,
    contentSize: 0,
    hooks: new EventEmitter(['momentum', 'end'])
  }
})

export default Behavior
