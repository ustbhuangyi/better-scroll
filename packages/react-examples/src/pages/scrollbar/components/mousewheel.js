import React, { useRef } from 'react'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'

import girlImageLink from './sad-girl.jpg'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

const Mousewheel = () => {
  const wrapperRef = useRef(null)
  const horizontalRef = useRef(null)
  const scrollRef = useRef(null)

  const onLoad = () => {
    scrollRef.current = new BScroll(wrapperRef.current, {
      scrollX: true,
      scrollY: false,
      click: true,
      mouseWheel: true,
      scrollbar: {
        customElements: [horizontalRef.current],
        fade: true,
        interactive: true,
        scrollbarTrackClickable: true,
      },
    })
  }

  return (
    <div className="mousewheel-scrollbar-container view">
      <div className="custom-scrollbar-wrapper" ref={wrapperRef}>
        <div class="custom-scrollbar-content">
          <img onLoad={onLoad} src={girlImageLink} alt="custom" />
        </div>
        {/* custom-horizontal-scrollbar */}
        <div className="custom-horizontal-scrollbar" ref={horizontalRef}>
          <div className="custom-horizontal-indicator"></div>
        </div>
      </div>
      <div className="tip">please use your mouse-wheel</div>
    </div>
  )
}

export default Mousewheel
