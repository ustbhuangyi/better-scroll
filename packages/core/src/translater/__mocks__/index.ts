import { EventEmitter } from '@better-scroll/shared-utils'

const Translater = jest.fn().mockImplementation((content) => {
  return {
    style: content.style,
    hooks: new EventEmitter(['beforeTranslate', 'translate']),
    getComputedPosition: jest
      .fn()
      .mockImplementation((position = { x: 0, y: 0 }) => {
        return position
      }),
    translate: jest.fn(),
    destroy: jest.fn(),
    setContent: jest.fn(),
  }
})

export default Translater
