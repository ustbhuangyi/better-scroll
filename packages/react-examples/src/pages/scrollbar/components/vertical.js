import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'

BScroll.use(ScrollBar)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const data = createArray(40)

const Vertical = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        scrollY: true,
        scrollbar: true,
      })
    }
  }, [])

  return (
    <div className="scrollbar view">
      <div className="scrollbar-wrapper" ref={wrapperRef}>
        <div className="scrollbar-content">
          {data.map((item) => (
            <div key={item} className="scrollbar-content-item">
              {`I am item ${item} `}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Vertical
