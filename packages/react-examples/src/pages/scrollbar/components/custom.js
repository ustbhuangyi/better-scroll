import React, { useRef } from 'react'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'

import girlImageLink from './girl.jpg'

BScroll.use(ScrollBar)

const Custom = () => {
  const wrapperRef = useRef(null)
  const verticalRef = useRef(null)
  const horizontalRef = useRef(null)
  const scrollRef = useRef(null)

  const onLoad = () => {
    scrollRef.current = new BScroll(wrapperRef.current, {
      freeScroll: true,
      click: true,
      scrollbar: {
        customElements: [horizontalRef.current, verticalRef.current],
        fade: false,
        interactive: true,
        scrollbarTrackClickable: true,
      },
    })
  }

  return (
    <div className="custom-scrollbar-container view">
      <div className="custom-scrollbar-wrapper" ref={wrapperRef}>
        <img
          onLoad={onLoad}
          className="custom-scrollbar-content"
          src={girlImageLink}
          alt="custom"
        />
        {/* custom-vertical-scrollbar */}
        <div className="custom-vertical-scrollbar" ref={verticalRef}>
          <div className="custom-vertical-indicator"></div>
        </div>
        {/* custom-horizontal-scrollbar */}
        <div className="custom-horizontal-scrollbar" ref={horizontalRef}>
          <div className="custom-horizontal-indicator"></div>
        </div>
      </div>
    </div>
  )
}

export default Custom
