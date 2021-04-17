import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(30)

const SpecifiedContent = () => {
  const scrollRef = useRef(null)
  const bs = useRef(null)

  useEffect(() => {
    if (!bs.current) {
      const BS = (bs.current = new BScroll(scrollRef.current, {
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
  }, [scrollRef.current])

  return (
    <div className="core-specified-content-container view">
      <div className="scroll-wrapper" ref={scrollRef}>
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
