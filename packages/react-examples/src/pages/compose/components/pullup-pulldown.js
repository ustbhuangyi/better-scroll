import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'

BScroll.use(PullDown)
BScroll.use(PullUp)

const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args) => callbackRef.current(...args), [])
}

const TIME_BOUNCE = 800
const REQUEST_TIME = 3000
const THRESHOLD = 70
const STOP = 56

function generateData() {
  return Array.from({ length: 30 }, (_, i) => i)
}

const ajaxGet = (/* url */) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateData())
    }, REQUEST_TIME)
  })
}

const PullUpPullDown = () => {
  const [beforePullDown, setBeforePullDown] = useState(true)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [isPullUpLoad, setIsPullUpLoad] = useState(false)
  const [data, setData] = useState(generateData())

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  const requestData = async (type) => {
    try {
      const newData = await ajaxGet(/* url */)
      if (type === 'load') {
        setData((prev) => newData.concat(prev))
      } else {
        setData(newData)
      }
    } catch (err) {
      // handle err
      console.log(err)
    }
  }

  const finishPullDown = () => {
    scrollRef.current.finishPullDown()
    setTimeout(() => {
      setBeforePullDown(true)
      scrollRef.current.refresh()
    }, TIME_BOUNCE + 100)
  }

  const pullingDownHandler = useStableCallback(async () => {
    setBeforePullDown(false)
    setIsPullingDown(true)
    await requestData('refresh')
    setIsPullingDown(false)
    finishPullDown()
  })

  const pullingUpHandler = useStableCallback(async () => {
    setIsPullUpLoad(true)
    await requestData('load')
    scrollRef.current.finishPullUp()
    scrollRef.current.refresh()
    setIsPullUpLoad(false)
  })

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        // pullDown options
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP,
        },
        // pullUp options
        pullUpLoad: {
          threshold: THRESHOLD,
        },
      }))

      BS.on('pullingDown', pullingDownHandler)
      BS.on('pullingUp', pullingUpHandler)
      BS.on('scroll', (pos) => {
        console.log(pos.y)
      })
    }
  }, [pullingDownHandler, pullingUpHandler])

  return (
    <div className="pullup-down view">
      <div className="pullup-down-bswrapper" ref={wrapperRef}>
        <div className="pulldown-scroller">
          <div className="pulldown-wrapper">
            <div style={{ display: beforePullDown ? '' : 'none' }}>
              <span>Pull Down and refresh</span>
            </div>
            <div style={{ display: beforePullDown ? 'none' : '' }}>
              <div v-show="isPullingDown">
                <span>Loading...</span>
              </div>
              <div style={{ display: isPullingDown ? 'none' : '' }}>
                <span>Refresh success</span>
              </div>
            </div>
          </div>
          <ul className="pullup-down-list">
            {data.map((_, index) => (
              <li key={index} className="pullup-down-list-item">
                {`I am item ${index} `}
              </li>
            ))}
          </ul>
          <div className="pullup-wrapper">
            {isPullUpLoad ? (
              <div>
                <span>Loading...</span>
              </div>
            ) : (
              <div>
                <span>Pull Up and load</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PullUpPullDown
