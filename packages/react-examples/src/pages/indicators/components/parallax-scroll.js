import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'

BScroll.use(Indicators)

const ParallaxScroll = () => {
  const wrapperRef = useRef(null)
  const indicator1Ref = useRef(null)
  const indicator2Ref = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        freeScroll: true,
        bounce: false,
        indicators: [
          {
            relationElement: indicator1Ref.current,
            interactive: false,
            ratio: 0.4,
          },
          {
            relationElement: indicator2Ref.current,
            interactive: false,
            ratio: 0.2,
          },
        ],
      })
    }
  }, [])

  return (
    <div className="parallax-scroll-container view">
      <div className="parallax-scroll-box">
        <div className="scroll-wrapper" ref={wrapperRef}>
          <div className="scroll-content"></div>
        </div>
        <div className="scroll-indicator stars1" ref={indicator1Ref}>
          <div className="star1-bg"></div>
        </div>
        <div className="scroll-indicator stars2" ref={indicator2Ref}>
          <div className="star2-bg"></div>
        </div>
      </div>
    </div>
  )
}

export default ParallaxScroll
