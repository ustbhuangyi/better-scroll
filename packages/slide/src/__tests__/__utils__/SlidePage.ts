export const change2safePage = jest.fn()
export const loopXGetter = jest.fn()
export const loopYGetter = jest.fn()
export const slideXGetter = jest.fn()
export const slideYGetter = jest.fn()
export const nextPage = jest.fn()
export const prevPage = jest.fn()
export const realPage2Page = jest.fn()
export const getRealPage = jest.fn().mockImplementation(page => {
  return {
    pageX: page.pageX,
    pageY: page.pageY
  }
})
export const nearestPage = jest.fn()
export const resetLoopPage = jest.fn()
export const currentPageSetter = jest.fn(v => v)
export const changeCurrentPage = jest.fn()
export const getInitPage = jest.fn()
export const SlidePage = jest.fn().mockImplementation(() => {
  let currentPage = {
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0
  }
  const slidePage = {
    getPageSize: jest.fn().mockImplementation(() => {
      return {
        width: 300,
        height: 300
      }
    }),
    init: () => {
      currentPage = {
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0
      }
    },
    change2safePage: change2safePage,
    nextPage: nextPage,
    prevPage: prevPage,
    realPage2Page: realPage2Page,
    getRealPage: getRealPage,
    nearestPage: nearestPage,
    resetLoopPage: resetLoopPage,
    getInitPage: getInitPage,
    changeCurrentPage: (v: {
      x: number
      y: number
      pageX: number
      pageY: number
    }) => {
      changeCurrentPage(v)
      currentPage = v
    },
    isSameWithCurrent: () => {
      return false
    }
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
