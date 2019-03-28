export const change2safePage = jest.fn()
export const loopXGetter = jest.fn()
export const loopYGetter = jest.fn()
export const slideXGetter = jest.fn()
export const slideYGetter = jest.fn()
export const nextPage = jest.fn()
export const prevPage = jest.fn()
export const realPage2Page = jest.fn()
export const getRealPage = jest.fn()
export const nearestPage = jest.fn()
export const resetLoopPage = jest.fn()
export const currentPageSetter = jest.fn(v => v)
export const SlidePage = jest.fn().mockImplementation(() => {
  let currentPage = {}
  const slidePage = {
    getPageSize: jest.fn().mockImplementation(() => {
      return {
        width: 300,
        height: 300
      }
    }),
    init: () => {},
    change2safePage: change2safePage,
    nextPage: nextPage,
    prevPage: prevPage,
    realPage2Page: realPage2Page,
    getRealPage: getRealPage,
    nearestPage: nearestPage,
    resetLoopPage: resetLoopPage
  }
  Object.defineProperty(slidePage, 'loopX', {
    get: loopXGetter
  })
  Object.defineProperty(slidePage, 'loopY', {
    get: loopYGetter
  })
  Object.defineProperty(slidePage, 'slideX', {
    get: slideXGetter
  })
  Object.defineProperty(slidePage, 'slideY', {
    get: slideYGetter
  })
  Object.defineProperty(slidePage, 'currentPage', {
    get: () => {
      return currentPage
    },
    set: v => {
      currentPage = currentPageSetter(v)
    }
  })
  return slidePage
})
