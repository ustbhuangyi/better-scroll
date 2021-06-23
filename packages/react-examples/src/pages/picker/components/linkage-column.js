import React, { useState, useRef, useEffect, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import BScroll from '@better-scroll/core'
import Wheel from '@better-scroll/wheel'

BScroll.use(Wheel)

const DATA = [
  {
    text: '北京市',
    value: '110000',
    children: [
      {
        text: '北京市',
        value: '110100',
      },
    ],
  },
  {
    text: '天津市',
    value: '120000',
    children: [
      {
        text: '天津市',
        value: '120000',
      },
    ],
  },
  {
    text: '河北省',
    value: '130000',
    children: [
      {
        text: '石家庄市',
        value: '130100',
      },
      {
        text: '唐山市',
        value: '130200',
      },
      {
        text: '秦皇岛市',
        value: '130300',
      },
      {
        text: '邯郸市',
        value: '130400',
      },
      {
        text: '邢台市',
        value: '130500',
      },
      {
        text: '保定市',
        value: '130600',
      },
      {
        text: '张家口市',
        value: '130700',
      },
      {
        text: '承德市',
        value: '130800',
      },
    ],
  },
  {
    text: '山西省',
    value: '140000',
    children: [
      {
        text: '太原市',
        value: '140100',
      },
      {
        text: '大同市',
        value: '140200',
      },
      {
        text: '阳泉市',
        value: '140300',
      },
      {
        text: '长治市',
        value: '140400',
      },
      {
        text: '晋城市',
        value: '140500',
      },
      {
        text: '朔州市',
        value: '140600',
      },
      {
        text: '晋中市',
        value: '140700',
      },
    ],
  },
]

const stopPropagation = (e) => {
  e.stopPropagation()
}

const preventDefault = (e) => {
  e.preventDefault()
}

const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args) => callbackRef.current(...args), [])
}

const LinkageColumn = () => {
  const [visible, setVisible] = useState(false)
  const [pickerData, setPickerData] = useState(() => [])
  const [selectedIndexPair, setSelectedIndexPair] = useState([0, 0])
  const [selectedText, setSelectedText] = useState('open')

  const wrapperRef = useRef(null)
  const scrollRef = useRef([])

  const loadPickerData = useStableCallback((newIndexPair, oldIndexPair) => {
    let provinces
    let cities
    // first instantiated
    if (!oldIndexPair) {
      provinces = DATA.map(({ value, text }) => ({ value, text }))
      cities = DATA[newIndexPair[0]].children
      setPickerData([provinces, cities])
    } else {
      // provinces'index changed, refresh cities data
      if (newIndexPair[0] !== oldIndexPair[0]) {
        cities = DATA[newIndexPair[0]].children.slice()
        setPickerData((prev) => {
          const next = [...prev]
          next.splice(1, 1, cities)
          return next
        })
        // Since cities data changed
        // refresh better-scroll to recaculate scrollHeight
        scrollRef.current[1].refresh()
      }
    }
  })

  const createWheels = useStableCallback(() => {
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

        // when any of wheels'scrolling ended , refresh data
        let prevSelectedIndexPair = selectedIndexPair
        BS.on('scrollEnd', () => {
          const currentSelectedIndexPair = scrollRef.current.map((wheel) =>
            wheel.getSelectedIndex()
          )
          loadPickerData(currentSelectedIndexPair, prevSelectedIndexPair)
          prevSelectedIndexPair = currentSelectedIndexPair
        })
      }
    }

    const wrapper = wrapperRef.current
    for (let i = 0; i < pickerData.length; i++) {
      createWheel(wrapper, i)
    }
  })

  useEffect(() => {
    loadPickerData(selectedIndexPair)
  }, [loadPickerData, selectedIndexPair])

  useEffect(() => {
    if (visible) {
      createWheels()
    }
  }, [visible, createWheels])

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
                        {data.map((item) => (
                          <li key={item.value} className="wheel-item">
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

export default LinkageColumn
