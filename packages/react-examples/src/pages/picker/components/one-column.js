import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)

const DATA = [
  {
    text: 'Venomancer',
    value: 1,
    disabled: 'wheel-disabled-item',
  },
  {
    text: 'Nerubian Weaver',
    value: 2,
  },
  {
    text: 'Spectre',
    value: 3,
  },
  {
    text: 'Juggernaut',
    value: 4,
  },
  {
    text: 'Karl',
    value: 5,
  },
  {
    text: 'Zeus',
    value: 6,
  },
  {
    text: 'Witch Doctor',
    value: 7,
  },
  {
    text: 'Lich',
    value: 8,
  },
  {
    text: 'Oracle',
    value: 9,
  },
  {
    text: 'Earthshaker',
    value: 10,
  },
]

const stopPropagation = (e) => {
  e.stopPropagation()
}

const preventDefault = (e) => {
  e.preventDefault()
}

const OneColumn = () => {
  const [visible, setVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [selectedText, setSelectedText] = useState('open')

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (visible) {
      if (!scrollRef.current) {
        const wrapper = wrapperRef.current.children[0]
        const BS = (scrollRef.current = new BScroll(wrapper, {
          wheel: {
            wheelWrapperClass: 'wheel-scroll',
            wheelItemClass: 'wheel-item',
            wheelDisabledItemClass: 'wheel-disabled-item',
            selectedIndex,
          },
          useTransition: false,
          probeType: 3,
        }))

        // < v2.1.0
        BS.on('scrollEnd', () => {
          console.log('BS.getSelectedIndex()', BS.getSelectedIndex())
        })
        // v2.1.0, only when selectedIndex changed
        BS.on('wheelIndexChanged', (index) => {
          console.log(index)
        })
      } else {
        scrollRef.current.refresh()
      }
    }
  }, [visible, selectedIndex])

  const handleShow = () => {
    if (visible) {
      return
    }
    setVisible(true)
  }

  const handleHide = () => {
    setVisible(false)
  }

  const handleConfirm = () => {
    /*
     * if bs is scrolling, force it stop at the nearest wheel-item
     * or you can use 'restorePosition' method as the below
     */
    scrollRef.current.stop()
    handleHide()
    const currentSelectedIndex = scrollRef.current.getSelectedIndex()
    setSelectedIndex(currentSelectedIndex)
    setSelectedText(
      `${DATA[currentSelectedIndex].text}-${currentSelectedIndex}`
    )
  }

  const handleCancel = () => {
    /*
     * if bs is scrolling, restore it to the start position
     * it is same with iOS picker and web Select element implementation
     * supported at v2.1.0
     */
    scrollRef.current.restorePosition()
    handleHide()
  }

  return (
    <div className="container view">
      <div className="container-btn" onClick={handleShow}>
        {selectedText}
      </div>
      <CSSTransition
        in={visible}
        classNames="picker-fade"
        timeout={300}
        onEnter={(node) => {
          node.style.display = 'block'
        }}
        onExited={(node) => {
          node.style.display = ''
        }}
      >
        <div
          className="picker"
          onClick={handleCancel}
          onTouchMove={preventDefault}
        >
          <CSSTransition in={visible} classNames="picker-move" timeout={300}>
            <div className="picker-panel" onClick={stopPropagation}>
              <div className="picker-choose border-bottom-1px">
                <span className="cancel" onClick={handleCancel}>
                  Cancel
                </span>
                <span className="confirm" onClick={handleConfirm}>
                  Confirm
                </span>
                <h1 className="picker-title">Title</h1>
              </div>
              <div className="picker-content">
                <div className="mask-top border-bottom-1px"></div>
                <div className="mask-bottom border-top-1px"></div>
                <div className="wheel-wrapper" ref={wrapperRef}>
                  <div className="wheel">
                    <ul className="wheel-scroll">
                      {DATA.map((item, index) => (
                        <li
                          key={index}
                          className={classNames([
                            'wheel-item',
                            { 'wheel-disabled-item': item.disabled },
                          ])}
                        >
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="picker-footer"></div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  )
}

export default OneColumn
