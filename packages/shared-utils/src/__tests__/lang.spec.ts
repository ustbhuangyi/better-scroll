import { findIndex } from '../lang'

describe('lang', () => {
  it('findIndex', () => {
    // hide ES6 findIndex
    // @ts-ignore
    Array.prototype.findIndex = undefined
    const array = [1, 2]
    const ret = findIndex(array, (item) => item % 2 === 0)
    expect(ret).toBe(1)
  })
})
