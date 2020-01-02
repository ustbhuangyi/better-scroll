import { bubbling } from '../bubbling'
import { EventEmitter } from '@better-scroll/shared-utils'

describe('bubbling', () => {
  it('bubbling', () => {
    const parentHooks = new EventEmitter(['test'])
    const childHooks = new EventEmitter(['test'])
    bubbling(childHooks, parentHooks, ['test'])
    const handler = jest.fn(() => {})
    parentHooks.on('test', handler)
    childHooks.trigger('test', 'dummy test')
    expect(handler).toBeCalledWith('dummy test')
  })
})
