const mockIndicator = jest
  .fn()
  .mockImplementation(function IndicatorMockFn(scroll: any, options: any) {
    return {
      wrapper: options.wrapper,
      destroy: jest.fn(),
    }
  })

export default mockIndicator
