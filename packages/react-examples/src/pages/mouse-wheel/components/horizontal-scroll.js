import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'

BScroll.use(MouseWheel)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const data = createArray(100)

const HorizontalScroll = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current = new BScroll(wrapperRef.current, {
      scrollX: true,
      scrollY: false,
      mouseWheel: true,
    })
  }, [])

  return (
    <div className="mouse-wheel-horizontal-scroll view">
      <div className="mouse-wheel-wrapper" ref={wrapperRef}>
        <div className="mouse-wheel-content">
          {data.map((item, index) => (
            <div key={index} className="mouse-wheel-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HorizontalScroll
