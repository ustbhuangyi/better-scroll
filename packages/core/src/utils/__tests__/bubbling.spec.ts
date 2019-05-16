import { bubbling } from '@better-scroll/core/src/utils/bubbling'
import EventEmitter from '@better-scroll/core/src/base/EventEmitter'

describe('bubbling', () => {
  it('bubbling', () => {
    const parentHooks = new EventEmitter(['test'])
    const childHooks = new EventEmitter(['test'])
    bubbling(childHooks, parentHooks, ['test'])
    const handler = jest.fn(() => {
      return 'return value'
    })
    parentHooks.on('test', handler)
    const t = childHooks.trigger('test')
    expect(t).toBe('return value')
  })
})
