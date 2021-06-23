import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'

BScroll.use(ScrollBar)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const data = createArray(40)

const Horizontal = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        scrollY: false,
        click: true,
        probeType: 1,
        scrollbar: {
          fade: false,
          interactive: true,
          scrollbarTrackClickable: true,
          scrollbarTrackOffsetType: 'clickedPoint', // can use 'step'
        },
      }))

      BS.on('scrollEnd', () => {
        console.log('scrollEnd')
      })
      BS.on('scrollStart', () => {
        console.log('scrollStart')
      })
      BS.on('scroll', () => {
        console.log('scroll')
      })
    }
  }, [])

  return (
    <div className="horizontal-scrollbar-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content">
          {data.map((item) => (
            <div key={item} className="scroll-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Horizontal
