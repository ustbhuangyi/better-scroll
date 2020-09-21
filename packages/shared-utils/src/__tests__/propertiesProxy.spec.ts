import { propertiesProxy } from '../propertiesProxy'

describe('propertiesProxy', () => {
  it('should proxy property correctly', () => {
    let obj = {
      a: {
        b: {
          c: 1,
        },
      },
    } as any
    propertiesProxy(obj, 'a.b.c', 'c')
    expect(obj.c).toBe(1)
    obj.c = 3
    expect(obj.a.b.c).toBe(3)
  })

  it('should prevent error when string path is wrong', () => {
    let obj = {
      a: {
        b: {
          d: 1,
        },
      },
    } as any
    propertiesProxy(obj, 'a.c.d', 'c')
    expect(obj.c).toBeFalsy()
    obj.c = 2
    expect(obj.a.c.d).toBe(2)
  })

  it('should change context when proxying method', () => {
    let obj = {
      a: {
        b: {
          c() {
            return (this as any).d
          },
          d: 1,
        },
      },
    } as any
    propertiesProxy(obj, 'a.b.c', 'c')
    expect(obj.c()).toBe(1)
  })
})
