const PagesMatrix = jest.fn().mockImplementation(() => {
  return {
    pages: [
      [
        {
          pageX: 0,
          pageY: 0,
          x: 0,
          y: 0,
        },
      ],
      [
        {
          pageX: 1,
          pageY: 0,
          x: 20,
          y: 0,
        },
      ],
      [
        {
          pageX: 2,
          pageY: 0,
          x: 40,
          y: 0,
        },
      ],
      [
        {
          pageX: 3,
          pageY: 0,
          x: 60,
          y: 0,
        },
      ],
    ],
    pageLengthOfX: 4,
    pageLengthOfY: 1,
    wrapperWidth: 0,
    wrapperHeight: 0,
    scrollerWidth: 0,
    scrollerHeight: 0,
    init: jest.fn(),
    getPageStats: jest.fn().mockImplementation(() => {
      return {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        cx: 50, // center position of every page
        cy: 50,
      }
    }),
    getNearestPageIndex: jest.fn().mockImplementation(() => {
      return {
        pageX: 1,
        pageY: 0,
      }
    }),
    buildPagesMatrix: jest.fn(),
  }
})

export default PagesMatrix
