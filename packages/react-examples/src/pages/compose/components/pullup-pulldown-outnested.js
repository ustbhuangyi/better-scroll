import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'
import NestedScroll from '@better-scroll/nested-scroll'

BScroll.use(PullDown)
BScroll.use(PullUp)
BScroll.use(NestedScroll)

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

const TOP_OUT_ITEMS = [
  '😀  😁   😂  🤣   😃  🙃',
  '👆🏻 Pull Down and refresh👆🏻',
  '🙂  🤔   😄  🤨   😐  🙃',
  '👆🏻 Pull Down and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️',
  '🙂  🤔  😄  🤨   😐  🙃 ',
  '👆🏻 Pull Down and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️ ',
]

const BOTTOM_OUT_ITEMS = [
  '😀  😁   😂  🤣   😃  🙃',
  '👆🏻 Pull Up and refresh👆🏻',
  '🙂  🤔   😄  🤨   😐  🙃',
  '👆🏻 Pull Up and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️',
  '🙂  🤔  😄  🤨   😐  🙃 ',
  '👆🏻 Pull Up and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️ ',
]

const INNER_ITEMS = [
  'The Mountain top of Inner',
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '👆🏻 inner scroll 👇🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🤓 🤓 🤓 🤓 🤓 🤓 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🦔 🦔 🦔 🦔 🦔 🦔 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🙈 🙈 🙈 🙈 🙈 🙈 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🚖 🚖 🚖 🚖 🚖 🚖 ',
  '👆🏻 inner scroll 👇🏻 ',
  '✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ',
  'The Mountain foot of Inner',
]

const ajaxGet = (/* url */) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        topOutItems: TOP_OUT_ITEMS,
        bottomOutItems: BOTTOM_OUT_ITEMS,
      })
    }, REQUEST_TIME)
  })
}

const PullUpPullDownNestedScroll = () => {
  const [beforePullDown, setBeforePullDown] = useState(true)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [isPullUpLoad, setIsPullUpLoad] = useState(false)
  const [topOutItems, setTopOutItems] = useState(TOP_OUT_ITEMS)
  const [bottomOutItems, setBottomOutItems] = useState(BOTTOM_OUT_ITEMS)

  const wrapperRef = useRef(null)
  const innerRef = useRef(null)
  const scrollRef = useRef(null)

  const requestData = async (type) => {
    try {
      const { topOutItems, bottomOutItems } = await ajaxGet(/* url */)
      if (type === 'load') {
        setBottomOutItems((prev) => bottomOutItems.concat(prev))
      } else {
        setTopOutItems(topOutItems)
        setBottomOutItems(bottomOutItems)
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
        nestedScroll: {
          groupId: 'pullup-pullldown',
        },
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

      new BScroll(innerRef.current, {
        nestedScroll: {
          groupId: 'pullup-pullldown',
        },
        // close bounce effects
        bounce: {
          top: false,
          bottom: false,
        },
      })
    }
  }, [pullingDownHandler, pullingUpHandler])

  return (
    <div className="pullup-pulldown-outnested view">
      <div className="outer-wrapper" ref={wrapperRef}>
        <div className="outer-content">
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
          <ul>
            {topOutItems.map((item, index) => (
              <li key={index} className="outer-list-item">
                {item}
              </li>
            ))}
          </ul>
          <div className="inner-wrapper" ref={innerRef}>
            <ul className="inner-content">
              {INNER_ITEMS.map((item, index) => (
                <li key={index} className="inner-list-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ul>
            {bottomOutItems.map((item, index) => (
              <li key={index} className="outer-list-item2">
                {item}
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

export default PullUpPullDownNestedScroll
