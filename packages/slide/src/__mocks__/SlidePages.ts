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
    pagesMatrix: new PagesMatrix({
      options: {},
    } as any),
    refresh: jest.fn(),
    checkSlideLoop: jest.fn(),
    setCurrentPage: jest.fn(),
    getInternalPage: jest.fn().mockImplementation((pageX, pageY) => {
      return {
        pageX,
        pageY,
        x: 20,
        y: 20,
      }
    }),
    getExposedPageByPageIndex: jest.fn(),
    getInitialPage: jest.fn().mockImplementation((flag, firstInit) => {
      if (firstInit) {
        return {
          pageX: 1,
          pageY: 0,
          x: 10,
          y: 10,
        }
      }
      return {
        pageX: 0,
        pageY: 0,
        x: 10,
        y: 10,
      }
    }),
    getExposedPage: jest.fn().mockImplementation((page) => {
      return (
        page || {
          pageX: 0,
          pageY: 0,
          x: 0,
          y: 0,
        }
      )
    }),
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
    getValidPageIndex: jest.fn().mockImplementation((pageX, pageY) => {
      return {
        pageX,
        pageY,
      }
    }),
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
    getNearestPage: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      }
    }),
    resetLoopPage: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
      }
    }),
    getPageIndexByDirection: jest.fn(),
    getPageByDirection: jest.fn().mockImplementation(() => {
      return {
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
      }
    }),
  }
})

export default SlidePage
