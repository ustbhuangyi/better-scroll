import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(8)

const HorizontalRotated = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        scrollY: false,
        // v2.3.0
        quadrant: 3, // rotate 180
      })
    }
  }, [])

  return (
    <div className="horizontal-rotated-container view">
      <div className="description">Flipping layout via CSS</div>
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

export default HorizontalRotated
