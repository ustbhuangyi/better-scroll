import { addEvent, removeEvent, offset, getRect, preventDefaultException, tap, click, prepend } from 'scroll/util/dom'

describe('dom.js', () => {
  it('#addEvent() & #removeEvent()', () => {
    const ele = document.createElement('div')
    const cb = sinon.spy()
    addEvent(ele, 'click', cb)
    ele.click()
    expect(cb)
      .to.be.calledOnce
    removeEvent(ele, 'click', cb)
    ele.click()
    expect(cb)
      .not.to.be.calledTwice
  })
  it('#offset()', () => {
    const ele = document.createElement('div')
    const { left, top } = offset(ele)
    expect(left)
      .to.equal(0)
    expect(top)
      .to.equal(0)
  })
  it('#getRect()', () => {
    const ele = document.createElement('div')
    document.body.appendChild(ele)
    const { top, left, width, height } = getRect(ele)
    expect(top)
      .to.equal(8)
    expect(left)
      .to.equal(8)
    expect(width)
      .to.equal(359)
    expect(height)
      .to.equal(0)
    document.body.removeChild(ele)
  })
  it('#preventDefaultException()', () => {
    const exceptions = {
      tagName: /div/i
    }
    const divEl = document.createElement('div')
    const spanEl = document.createElement('span')
    expect(preventDefaultException(divEl, exceptions))
      .to.be.true
    expect(preventDefaultException(spanEl, exceptions))
      .to.be.false
  })
  it('#tap', () => {
    const ele = document.createElement('div')
    const cb = sinon.spy()
    const event = {
      pageX: 1,
      pageY: 2,
      target: ele
    }
    addEvent(ele, 'tap', cb)
    tap(event, 'tap')
    expect(cb)
      .to.be.calledOnce
  })
  it('#click', () => {
    let ele = document.createElement('div')
    let cb = sinon.spy()
    let event = {
      target: ele
    }
    addEvent(ele, 'click', cb)
    click(event)
    expect(cb)
      .to.be.calledOnce
    // input
    ele = document.createElement('input')
    cb = sinon.spy()
    event = {
      target: ele
    }
    addEvent(ele, 'click', cb)
    click(event)
    expect(cb)
      .not.to.be.called
  })
  it('#prepend', () => {
    const ele = document.createElement('div')
    const target = document.createElement('span')
    const el = document.createElement('section')
    prepend(el, ele)
    expect(ele.firstChild)
      .to.equal(el)
    expect(ele.childNodes.length)
      .to.equal(1)
    prepend(target, ele)
    expect(ele.firstChild)
      .to.equal(target)
  })
})
