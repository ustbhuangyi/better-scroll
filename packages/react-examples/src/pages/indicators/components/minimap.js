import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'

import dinnerLink from './dinner.jpg'

BScroll.use(Indicators)

const Minimap = () => {
  const wrapperRef = useRef(null)
  const indicatorWrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        startX: -50,
        startY: -50,
        freeScroll: true,
        bounce: false,
        indicators: [
          {
            relationElement: indicatorWrapperRef.current,
            // choose div.scroll-indicator-handle as indicatorHandle
            relationElementHandleElementIndex: 1,
          },
        ],
      })
    }
  }, [])

  return (
    <div className="minimap-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        {/* maxWidth is used to overwrite vuepress default theme style */}
        {/* because this component is used in vuepress markdown as a demo */}
        <img className="scroll-content" src={dinnerLink} alt="custom" />
      </div>
      <div className="scroll-indicator" ref={indicatorWrapperRef}>
        <img className="scroll-indicator-bg" src={dinnerLink} alt="custom" />
        <div className="scroll-indicator-handle"></div>
      </div>
    </div>
  )
}

export default Minimap
