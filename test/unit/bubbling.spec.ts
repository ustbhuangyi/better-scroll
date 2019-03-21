import { bubbling } from '../../src/util/bubbling'
import EventEmitter from '../../src/base/EventEmitter'

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
