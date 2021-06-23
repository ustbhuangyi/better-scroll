import React, { useState, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)

const DATA1 = [
  {
    text: 'Venomancer',
    value: 1,
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

const DATA2 = [
  {
    text: 'Durable',
    value: 'a',
  },
  {
    text: 'Pusher',
    value: 'b',
  },
  {
    text: 'Carry',
    value: 'c',
  },
  {
    text: 'Nuker',
    value: 'd',
  },
  {
    text: 'Support',
    value: 'e',
  },
  {
    text: 'Jungle',
    value: 'f',
  },
  {
    text: 'Escape',
    value: 'g',
  },
  {
    text: 'Initiator',
    value: 'h',
  },
]

const stopPropagation = (e) => {
  e.stopPropagation()
}

const preventDefault = (e) => {
  e.preventDefault()
}

const pickerData = [DATA1, DATA2]

const DoubleColumn = () => {
  const [visible, setVisible] = useState(false)
  const [selectedIndexPair, setSelectedIndexPair] = useState([0, 0])
  const [selectedText, setSelectedText] = useState('open')

  const wrapperRef = useRef(null)
  const scrollRef = useRef([])

  useEffect(() => {
    if (visible) {
      const createWheel = (wheelWrapper, i) => {
        if (scrollRef.current[i]) {
          scrollRef.current[i].refresh()
        } else {
          const BS = (scrollRef.current[i] = new BScroll(
            wheelWrapper.children[i],
            {
              wheel: {
                wheelWrapperClass: 'wheel-scroll',
                wheelItemClass: 'wheel-item',
                selectedIndex: selectedIndexPair[i],
              },
              useTransition: false,
              probeType: 3,
            }
          ))

          // < v2.1.0
          BS.on('scrollEnd', () => {
            console.log('BS.getSelectedIndex()', BS.getSelectedIndex())
          })
        }
      }

      const wrapper = wrapperRef.current
      for (let i = 0; i < pickerData.length; i++) {
        createWheel(wrapper, i)
      }
    }
  }, [visible, selectedIndexPair])

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
    scrollRef.current.forEach((wheel) => {
      /*
       * if bs is scrolling, force it stop at the nearest wheel-item
       * or you can use 'restorePosition' method as the below
       */
      // wheel.stop()
      /*
       * if bs is scrolling, restore it to the start position
       * it is same with iOS picker and web Select element implementation
       * supported at v2.1.0
       */
      wheel.restorePosition()
    })
    handleHide()
    const currentSelectedIndexPair = scrollRef.current.map((wheel) =>
      wheel.getSelectedIndex()
    )
    setSelectedIndexPair(currentSelectedIndexPair)
    setSelectedText(
      pickerData
        .map((data, i) => {
          const index = currentSelectedIndexPair[i]
          return `${data[index].text}-${index}`
        })
        .join('__')
    )
  }

  const handleCancel = () => {
    /*
     * if bs is scrolling, restore it to the start position
     * it is same with iOS picker and web Select element implementation
     * supported at v2.1.0
     */
    scrollRef.current.forEach((wheel) => {
      wheel.restorePosition()
    })
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
                  {pickerData.map((data, index) => (
                    <div className="wheel" key={index}>
                      <ul className="wheel-scroll">
                        {data.map((item, index) => (
                          <li key={index} className="wheel-item">
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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

export default DoubleColumn
