import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'
import Slide from '@better-scroll/slide'

BScroll.use(PullDown)
BScroll.use(PullUp)
BScroll.use(Slide)

const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args) => callbackRef.current(...args), [])
}

const TIME_BOUNCE = 700
const REQUEST_TIME = 1000
const THRESHOLD = 50
const STOP = 56

function generateData() {
  return Array.from({ length: 2 }, (_, i) => i)
}

const ajaxGet = (/* url */) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateData())
    }, REQUEST_TIME)
  })
}

const PullUpPullDownSlide = () => {
  const [beforePullDown, setBeforePullDown] = useState(true)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [isPullUpLoad, setIsPullUpLoad] = useState(false)
  const [data, setData] = useState(generateData())

  const stopPullup = useRef(false)

  const wrapperRef = useRef(null)
  const pulldownRef = useRef(null)
  const pullupRef = useRef(null)
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

  const resetPullUpPos = () => {
    const pullUpEle = pullupRef.current
    pullUpEle.style.transform = `translateY(0px) translateZ(0)`
    pullUpEle.style.transition = 'transform 0.5s'
    stopPullup.current = false
  }

  const finishPullDown = () => {
    scrollRef.current.finishPullDown()
    scrollRef.current.enabled = true
    setTimeout(() => {
      setBeforePullDown(true)
      scrollRef.current.refresh()
    }, TIME_BOUNCE + 100)
  }

  const pullingDownHandler = useStableCallback(async () => {
    setBeforePullDown(false)
    setIsPullingDown(true)
    scrollRef.current.enabled = false
    await requestData('refresh')
    setIsPullingDown(false)
    finishPullDown()
  })

  const pullingUpHandler = useStableCallback(async () => {
    setIsPullUpLoad(true)
    scrollRef.current.enabled = false
    await requestData('load')
    scrollRef.current.finishPullUp()
    scrollRef.current.enabled = true
    scrollRef.current.refresh()
    setIsPullUpLoad(false)
    resetPullUpPos()
  })

  const scrollHandler = useStableCallback((pos) => {
    if (pos.y >= 0) {
      const pullDownEle = pulldownRef.current
      const { height: pulldownH } = getComputedStyle(pullDownEle, null)
      pullDownEle.style.transform = `translateY(${
        -parseInt(pulldownH) + pos.y
      }px) translateZ(0)`
    }
    const pullupThreshold = -30
    const maxScrollY = scrollRef.current.maxScrollY
    if (pos.y - maxScrollY <= pullupThreshold && isPullUpLoad) {
      stopPullup.current = true
    }
    if (pos.y - maxScrollY <= 0 && !stopPullup.current) {
      const pullUpEle = pullupRef.current
      pullUpEle.style.transform = `translateY(${
        pos.y - maxScrollY
      }px) translateZ(0)`
    }
  })

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        momentum: false,
        // pullDown options
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP,
        },
        // pullUp options
        pullUpLoad: {
          threshold: -THRESHOLD,
        },
        // slide options
        slide: {
          threshold: 5,
          disableSetHeight: true,
          autoplay: false,
          loop: false,
        },
      }))

      BS.on('pullingDown', pullingDownHandler)
      BS.on('pullingUp', pullingUpHandler)
      BS.on('scroll', scrollHandler)
    }
  }, [pullingDownHandler, pullingUpHandler, scrollHandler])

  return (
    <div className="pullup-down-slide-wrapper view">
      {/* pull down */}
      <div className="pulldown-wrapper" ref={pulldownRef}>
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
      {/* slide item */}
      <div className="pullup-pulldown-slide-bswrapper" ref={wrapperRef}>
        <div className="pullup-pulldown-slide-scroller">
          {data.map((_, index) => (
            <div
              key={index}
              className={`pullup-pulldown-slide-item page${index % 4}`}
            >
              {`Page ${index} `}
            </div>
          ))}
        </div>
      </div>
      {/* pollup */}
      <div className="pullup-wrapper" ref={pullupRef}>
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
  )
}

export default PullUpPullDownSlide
