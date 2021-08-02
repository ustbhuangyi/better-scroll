import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)

function generateData() {
  const BASE = 30
  const begin = BASE * STEP
  const end = BASE * (STEP + 1)
  let ret = []
  for (let i = end; i > begin; i--) {
    ret.push(i)
  }
  return ret
}

// pulldownRefresh state
const PHASE = {
  moving: {
    enter: 'enter',
    leave: 'leave',
  },
  fetching: 'fetching',
  succeed: 'succeed',
}
const TIME_BOUNCE = 800
const REQUEST_TIME = 2000
const THRESHOLD = 70
const STOP = 56
let STEP = 0
const ARROW_BOTTOM =
  '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>'
const ARROW_UP =
  '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>'

const mockFetchData = (/* url */) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dataList = generateData()
      resolve(dataList)
    }, REQUEST_TIME)
  })
}

const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args) => callbackRef.current(...args), [])
}

const Sina = () => {
  const [tipText, setTipText] = useState('')
  const [data, setData] = useState(generateData())

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  const getData = async () => {
    try {
      const newData = await mockFetchData()
      setData((prev) => newData.concat(prev))
    } catch (err) {
      // handle err
      console.log(err)
    }
  }

  const pullingDownHandler = useStableCallback(async () => {
    updateTipText(PHASE.fetching)
    STEP += 1
    await getData()
    updateTipText(PHASE.succeed)
    scrollRef.current.finishPullDown()
    setTimeout(() => {
      scrollRef.current.refresh()
    }, TIME_BOUNCE + 50)
  })

  const updateTipText = useStableCallback((phase = PHASE.default) => {
    const TEXTS_MAP = {
      enter: `${ARROW_BOTTOM} Pull down`,
      leave: `${ARROW_UP} Release`,
      fetching: 'Loading...',
      succeed: 'Refresh succeed',
    }
    setTipText(TEXTS_MAP[phase])
  })

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        useTransition: false,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP,
        },
      }))

      BS.on('pullingDown', pullingDownHandler)

      BS.on('scrollEnd', () => {
        console.log('scrollEnd')
      })

      // v2.4.0 supported
      BS.on('enterThreshold', () => {
        updateTipText(PHASE.moving.enter)
      })

      BS.on('leaveThreshold', () => {
        updateTipText(PHASE.moving.leave)
      })
    }
  }, [pullingDownHandler, updateTipText])

  return (
    <div className="pulldown view">
      <div className="pulldown-bswrapper" ref={wrapperRef}>
        <div className="pulldown-scroller">
          <div className="pulldown-wrapper">
            <div dangerouslySetInnerHTML={{ __html: tipText }}></div>
          </div>
          <ul className="pulldown-list">
            {data.map((item, index) => (
              <li key={index} className="pulldown-list-item">
                {`I am item ${item} `}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sina
