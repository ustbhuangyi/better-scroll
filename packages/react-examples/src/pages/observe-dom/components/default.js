import React, { useState, useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)

const Default = () => {
  const [num, setNum] = useState(10)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        observeDOM: true,
        scrollX: true,
        scrollY: false,
      })
    }
  }, [])

  const handleClick = () => {
    setNum((n) => n + 2)
  }

  return (
    <div className="observe-dom-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content">
          {createArray(num).map((item, index) => (
            <div
              key={index}
              className="scroll-item"
              onClick={() => handleClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <button className="btn" onClick={handleClick}>
        append two children element
      </button>
    </div>
  )
}

export default Default
