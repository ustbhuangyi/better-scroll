import React, { useState, useRef, useEffect, useCallback } from 'react'
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import MouseWheel from '@better-scroll/mouse-wheel'

BScroll.use(PullDown)
BScroll.use(MouseWheel)

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
      const dataList = generateData()
      resolve(dataList)
    }, 1000)
  })
}

const TIME_BOUNCE = 800
let STEP = 0

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

const Pulldown = () => {
  const [beforePullDown, setBeforePullDown] = useState(true)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [data, setData] = useState(generateData())

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  const requestData = async () => {
    try {
      const newData = await ajaxGet(/* url */)
      setData((prev) => newData.concat(prev))
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
    STEP += 1
    await requestData()
    setIsPullingDown(false)
    finishPullDown()
  })

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        pullDownRefresh: {
          threshold: 70,
          stop: 56,
        },
        mouseWheel: true,
      }))

      BS.on('pullingDown', pullingDownHandler)

      BS.on('scroll', (pos) => {
        console.log(pos.y)
      })

      BS.on('scrollEnd', () => {
        console.log('scrollEnd')
      })
    }
  }, [pullingDownHandler])

  return (
    <div className="mouse-wheel-pulldown view">
      <div className="pulldown-wrapper" ref={wrapperRef}>
        <div className="pulldown-content">
          <div className="pulldown-tips">
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

export default Pulldown
