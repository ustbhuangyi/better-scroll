export const mockGetRect = jest.fn((el: HTMLElement) => {
  return {
    width: parseFloat(el.getAttribute('data-width') || '0') || 0,
    height: parseFloat(el.getAttribute('data-height') || '0') || 0,
    left: parseFloat(el.getAttribute('data-left') || '0') || 0,
    top: parseFloat(el.getAttribute('data-top') || '0') || 0
  }
})
