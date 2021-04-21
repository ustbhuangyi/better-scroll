import React, { useState, useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums1 = createArray(30)
const nums2 = createArray(60)

const DynamicContent = () => {
  const [switcher, setSwitcher] = useState(false)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        probeType: 3,
      }))

      BS.on('contentChanged', (content) => {
        console.log('--- newContent ---')
        console.log(content)
      })
      BS.on('scroll', () => {
        console.log('scrolling-')
      })
      BS.on('scrollEnd', () => {
        console.log('scrollingEnd')
      })
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.refresh()
    }
  }, [switcher])

  const handleClick = () => {
    setSwitcher((value) => !value)
  }

  return (
    <div className="core-dynamic-content-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        {switcher ? (
          <div className="scroll-content c2" key="c2">
            {nums2.map((item) => (
              <div key={item} className="scroll-item">
                {nums2.length - item + 1}
              </div>
            ))}
          </div>
        ) : (
          <div className="scroll-content c1" key="c1">
            {nums1.map((item) => (
              <div key={item} className="scroll-item">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="btn" onClick={handleClick}>
        switch content element
      </button>
    </div>
  )
}

export default DynamicContent
