const mockIndicator = jest
  .fn()
  .mockImplementation(function IndicatorMockFn(scroll: any, options: any) {
    return {
      destroy: jest.fn(),
    }
  })

export default mockIndicator
