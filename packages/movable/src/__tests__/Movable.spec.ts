import BScroll from '@better-scroll/core'
import Movable from '../index'
import {
  createDiv,
  mockDomOffset
} from '@better-scroll/core/src/__tests__/__utils__/layout'

jest.mock('@better-scroll/core')

function createBS() {
  const dom = createDiv(300, 300)
  const contentDom = createDiv(300, 300)
  dom.appendChild(contentDom)
  const bs = new BScroll(dom) as any
  return bs
}

// todo unit tests
