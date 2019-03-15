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
export const pageInfo = jest.fn().mockImplementation(() => {
  let currentPage = {}
  const pageInfo = {
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
  Object.defineProperty(pageInfo, 'loopX', {
    get: loopXGetter
  })
  Object.defineProperty(pageInfo, 'loopY', {
    get: loopYGetter
  })
  Object.defineProperty(pageInfo, 'slideX', {
    get: slideXGetter
  })
  Object.defineProperty(pageInfo, 'slideY', {
    get: slideYGetter
  })
  Object.defineProperty(pageInfo, 'currentPage', {
    get: () => {
      return currentPage
    },
    set: v => {
      currentPage = currentPageSetter(v)
    }
  })
  return pageInfo
})
