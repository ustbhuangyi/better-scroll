import BScroll from 'scroll/index'

describe('BScroll - wheel', () => {
  let wheels = []
  beforeEach(() => {
    let style = document.createElement('style')
    style.type = 'text/css'
    const styleSheet = `
      ul {
        width: 100px;
        list-style: none;
        display: inline-block;
        margin: 0;
      }
      .wheel-wrapper {
        display: flex;
        overflow: hidden;
      }
      .wheel {
        flex: 1;
        height: 173px;
      }
      .wheel-scroll {
        padding: 0;
        margin-top: 68px;
        line-height: 36px;
        list-style: none;
      }
    `
    style.appendChild(document.createTextNode(styleSheet))
    document.head.appendChild(style)

    const wrapper = document.createElement('div')
    wrapper.className = 'wheel-wrapper'
    const listArr = []
    document.body.appendChild(wrapper)

    for (let i = 0; i < 3; i++) {
      let ulHTML = ''
      const ul = document.createElement('ul')
      ul.className = 'wheel-scroll'
      const scroller = document.createElement('div')
      scroller.className = 'wheel'
      for (let i = 0; i < 100; i++) {
        ulHTML += `<li>${i}</li>`
      }
      ul.innerHTML = ulHTML
      listArr.push(ul)
      scroller.appendChild(ul)
      wrapper.appendChild(scroller)
      wheels[i] = new BScroll(wrapper.children[i], {
        wheel: {
          selectedIndex: 2
        },
        probeType: 3
      })
    }
  })
  afterEach(() => {
    wheels = []
    document.body.removeChild(document.querySelector('.wheel-wrapper'))
  })
  it('wheelTo', () => {
    const wheel = wheels[0]
    wheel.wheelTo(4)
    expect(wheel.getSelectedIndex())
      .to.equal(4)
    expect(wheel.y)
      .to.equal(-1 * wheel.itemHeight * 4)
  })
  it('getSelectedIndex', () => {
    const [firstWheel, secondWheel, thirdWheel] = [...wheels]
    expect(firstWheel.getSelectedIndex())
      .to.equal(2)
    expect(secondWheel.getSelectedIndex())
      .to.equal(2)
    expect(thirdWheel.getSelectedIndex())
      .to.equal(2)
  })
})
