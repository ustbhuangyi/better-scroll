import PagesMatrix from '../PagesMatrix'
jest.mock('../PagesMatrix')

const SlidePage = jest.fn().mockImplementation(() => {
  return {
    currentPage: {
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0,
    },
    loopX: true,
    loopY: false,
    slideX: true,
    slideY: false,
    needLoop: true,
    pagesMatrix: new PagesMatrix({} as any),
    refresh: jest.fn(),
    checkSlideLoop: jest.fn(),
    setCurrentPage: jest.fn(),
    getInternalPage: jest.fn(),
    getInitialPage: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
        x: 10,
        y: 10,
      }
    }),
    getExposedPage: jest.fn(),
    getWillChangedPage: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      }
    }),
    fixedPage: jest.fn(),
    getPageStats: jest.fn().mockImplementation(() => {
      return {
        width: 0,
        height: 0,
      }
    }),
    getValidPageIndex: jest.fn(),
    nextPageIndex: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
      }
    }),
    prevPageIndex: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
      }
    }),
    nearestPage: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      }
    }),
    resetLoopPage: jest.fn(),
    getPageIndexByDirection: jest.fn(),
  }
})

export default SlidePage
