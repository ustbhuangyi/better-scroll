import createAnimater from '@/animater/index'
import Translater from '@/translater'

jest.mock('@/animater/index')

const Scroller = jest.fn().mockImplementation((wrapper, bscrollOptions) => {
  const content = wrapper.children[0]
  const translater = new Translater(content)
  const animater = createAnimater(content, translater, bscrollOptions)
  return {
    wrapper,
    content,
    options: bscrollOptions,
    translater,
    animater
  }
})

export default Scroller
