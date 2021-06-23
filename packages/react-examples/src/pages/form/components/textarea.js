import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const data = createArray(10)

const Textarea = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        autoBlur: true, // for blur
      })
    }
  }, [])

  return (
    <div className="textarea-container view">
      <div className="textarea-wrapper" ref={wrapperRef}>
        <div className="textarea-scroller">
          <ul className="textarea-list">
            {data.map((item) => (
              <li key={item} className="textarea-list-item"></li>
            ))}
            <textarea
              className="textarea-text"
              name=""
              id=""
              cols="30"
              rows="10"
              defaultValue="Manipulating this area can not make BetterScroll work."
            ></textarea>
            {data.map((item) => (
              <li key={item} className="textarea-list-item"></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Textarea
