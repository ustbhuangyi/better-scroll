import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(8)

const VerticalRotated = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        // v2.3.0
        quadrant: 2, // rotate 90
      })
    }
  }, [])

  return (
    <div className="vertical-rotated-container view">
      <div className="description">Horizontal layout via CSS</div>
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content">
          {nums.map((item, index) => (
            <div key={index} className="scroll-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VerticalRotated
