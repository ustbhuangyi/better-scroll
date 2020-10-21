const PagesMatrix = jest.fn().mockImplementation((scroll) => {
  const loopX = scroll.options.scrollX
  const loopY = scroll.options.scrollY
  const pages = loopX
    ? [
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
      ]
    : loopY
    ? [
        [
          {
            pageX: 0,
            pageY: 0,
            x: 0,
            y: 0,
          },
          {
            pageX: 0,
            pageY: 1,
            x: 0,
            y: 20,
          },
          {
            pageX: 0,
            pageY: 2,
            x: 0,
            y: 40,
          },
          {
            pageX: 0,
            pageY: 3,
            x: 0,
            y: 60,
          },
        ],
      ]
    : []
  return {
    pages,
    pageLengthOfX: loopX ? 4 : 1,
    pageLengthOfY: loopY ? 4 : 1,
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
