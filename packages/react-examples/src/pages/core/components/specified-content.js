import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(30)

const SpecifiedContent = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        specifiedIndexAsContent: 1,
        probeType: 3,
      }))

      BS.on('scroll', () => {
        console.log('scrolling-')
      })
      BS.on('scrollEnd', () => {
        console.log('scrollingEnd')
      })
    }
  }, [])

  return (
    <div className="core-specified-content-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="ignore-content">
          The Blue area is not taken as BetterScroll's content
        </div>
        <div className="scroll-content">
          {nums.map((item) => (
            <div key={item} className="scroll-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecifiedContent
