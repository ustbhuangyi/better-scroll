import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)

const useStableCallback = (callback) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args) => callbackRef.current(...args), [])
}

const ajaxGet = (/* url */) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(20)
    }, 1000)
  })
}

const Default = () => {
  const [isPullUpLoad, setIsPullUpLoad] = useState(false)
  const [num, setNum] = useState(20)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  const requestData = async () => {
    try {
      const newData = await ajaxGet(/* url */)
      setNum((n) => n + newData)
    } catch (err) {
      // handle err
      console.log(err)
    }
  }

  const pullingUpHandler = useStableCallback(async () => {
    setIsPullUpLoad(true)
    await requestData()
    scrollRef.current.finishPullUp()
    scrollRef.current.refresh()
    setIsPullUpLoad(false)
  })

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        pullUpLoad: true,
      }))

      BS.on('pullingUp', pullingUpHandler)
    }
  }, [pullingUpHandler])

  return (
    <div className="pullup view">
      <div className="pullup-wrapper" ref={wrapperRef}>
        <div className="pullup-content">
          <ul className="pullup-list">
            {createArray(num).map((item, index) => (
              <li key={index} className="pullup-list-item">
                {item % 5 === 0 ? 'scroll up 👆🏻' : `I am item ${item} `}
              </li>
            ))}
          </ul>
          <div className="pullup-tips">
            {isPullUpLoad ? (
              <div className="after-trigger">
                <span className="pullup-txt">Loading...</span>
              </div>
            ) : (
              <div className="before-trigger">
                <span className="pullup-txt">Pull up and load more</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Default
