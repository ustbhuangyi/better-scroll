export const mockClientWidth = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  get: mockClientWidth.get
})
